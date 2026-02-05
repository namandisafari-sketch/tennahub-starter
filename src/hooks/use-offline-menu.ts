import { useEffect, useState } from "react";

interface CachedMenuData {
  tenant: {
    id: string;
    name: string;
    business_type: string | null;
  } | null;
  categories: Array<{
    id: string;
    name: string;
    description: string | null;
    display_order: number;
  }>;
  menuItems: Array<{
    id: string;
    name: string;
    description: string | null;
    unit_price: number;
    category_id: string | null;
    is_active: boolean;
  }>;
  table: {
    table_number: string;
    location: string | null;
  } | null;
  cachedAt: number;
}

const CACHE_KEY_PREFIX = "offline_menu_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useOfflineMenu(tenantId: string | undefined, tableId: string | undefined) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState<CachedMenuData | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load cached data on mount
  useEffect(() => {
    if (!tenantId) return;

    const cacheKey = `${CACHE_KEY_PREFIX}${tenantId}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data: CachedMenuData = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - data.cachedAt < CACHE_DURATION) {
          setCachedData(data);
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (e) {
      console.error("Error loading cached menu:", e);
    }
  }, [tenantId]);

  // Function to cache menu data
  const cacheMenuData = (data: Omit<CachedMenuData, "cachedAt">) => {
    if (!tenantId) return;

    const cacheKey = `${CACHE_KEY_PREFIX}${tenantId}`;
    const cacheData: CachedMenuData = {
      ...data,
      cachedAt: Date.now(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      setCachedData(cacheData);
    } catch (e) {
      console.error("Error caching menu:", e);
    }
  };

  // Get cache age in human-readable format
  const getCacheAge = (): string | null => {
    if (!cachedData) return null;
    
    const ageMs = Date.now() - cachedData.cachedAt;
    const ageMinutes = Math.floor(ageMs / 60000);
    const ageHours = Math.floor(ageMinutes / 60);
    
    if (ageHours > 0) {
      return `${ageHours}h ago`;
    } else if (ageMinutes > 0) {
      return `${ageMinutes}m ago`;
    }
    return "just now";
  };

  return {
    isOnline,
    cachedData,
    cacheMenuData,
    getCacheAge,
    hasCachedData: !!cachedData,
  };
}
