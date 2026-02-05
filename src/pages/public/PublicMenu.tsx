import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Sparkles, WifiOff, RefreshCw } from "lucide-react";
import { useOfflineMenu } from "@/hooks/use-offline-menu";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  unit_price: number;
  category_id: string | null;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

const PublicMenu = () => {
  const { tenantId, tableId } = useParams();
  const { isOnline, cachedData, cacheMenuData, getCacheAge, hasCachedData } = useOfflineMenu(tenantId, tableId);

  const { data: tenant, isLoading: tenantLoading, error: tenantError } = useQuery({
    queryKey: ['public-tenant', tenantId],
    queryFn: async () => {
      if (!tenantId) return null;
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, business_type')
        .eq('id', tenantId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!tenantId && isOnline,
    retry: isOnline ? 3 : 0,
  });

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ['public-categories', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!tenantId && isOnline,
    retry: isOnline ? 3 : 0,
  });

  const { data: menuItems, isLoading: menuLoading, error: menuError } = useQuery({
    queryKey: ['public-menu', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!tenantId && isOnline,
    retry: isOnline ? 3 : 0,
  });

  const { data: table } = useQuery({
    queryKey: ['public-table', tableId],
    queryFn: async () => {
      if (!tableId) return null;
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('table_number, location')
        .eq('id', tableId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!tableId && isOnline,
    retry: isOnline ? 3 : 0,
  });

  // Cache data when online and data is loaded
  useEffect(() => {
    if (isOnline && tenant && menuItems && categories) {
      cacheMenuData({
        tenant,
        categories,
        menuItems,
        table: table || null,
      });
    }
  }, [isOnline, tenant, menuItems, categories, table]);

  // Use cached data when offline or when online data fails
  const displayTenant = tenant || cachedData?.tenant;
  const displayCategories = categories || cachedData?.categories || [];
  const displayMenuItems = menuItems || cachedData?.menuItems || [];
  const displayTable = table || cachedData?.table;

  const isLoading = tenantLoading || menuLoading;
  const hasError = tenantError || menuError || categoriesError;
  const isUsingCache = !isOnline || (hasError && hasCachedData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getItemsByCategory = (categoryId: string) => {
    return displayMenuItems?.filter(item => item.category_id === categoryId) || [];
  };

  const uncategorizedItems = displayMenuItems?.filter(item => !item.category_id) || [];

  // Show loading only when online and no cache
  if (isLoading && !hasCachedData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-24 w-full bg-amber-100/50" />
          <Skeleton className="h-40 w-full bg-amber-100/50" />
          <Skeleton className="h-40 w-full bg-amber-100/50" />
        </div>
      </div>
    );
  }

  // Show offline message if no data available
  if (!displayTenant && !isOnline) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-amber-200/50 bg-white/80 shadow-lg">
          <CardContent className="pt-8 text-center">
            <WifiOff className="h-16 w-16 mx-auto text-amber-600 mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-2">You're Offline</h2>
            <p className="text-amber-700/70 mb-4">
              Please connect to the internet to load the menu for the first time.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!displayTenant) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-amber-200/50 bg-white/80 shadow-lg">
          <CardContent className="pt-8 text-center">
            <UtensilsCrossed className="h-16 w-16 mx-auto text-amber-600 mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-2">Menu Not Found</h2>
            <p className="text-amber-700/70">
              Please scan a valid QR code to view our menu.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DecorativeDivider = () => (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
      <Sparkles className="h-4 w-4 text-amber-500" />
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
    </div>
  );

  const CategoryDivider = ({ title, description }: { title: string; description?: string | null }) => (
    <div className="text-center py-6">
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400/60" />
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-amber-900 tracking-wide uppercase">
          {title}
        </h2>
        <div className="h-px w-16 bg-gradient-to-l from-transparent via-amber-400/40 to-amber-400/60" />
      </div>
      {description && (
        <p className="text-sm text-amber-700/60 italic font-light mt-1">{description}</p>
      )}
    </div>
  );

  const MenuItemRow = ({ item }: { item: MenuItem }) => (
    <div className="py-3 group">
      <div className="flex items-baseline gap-2">
        <h3 className="font-serif text-base sm:text-lg font-medium text-amber-950 group-hover:text-amber-700 transition-colors">
          {item.name}
        </h3>
        <div className="flex-1 border-b border-dotted border-amber-300/60 mx-2 mb-1" />
        <span className="font-serif font-semibold text-amber-800 whitespace-nowrap">
          UGX {formatCurrency(item.unit_price)}
        </span>
      </div>
      {item.description && (
        <p className="text-sm text-amber-700/70 italic mt-1 pl-0.5 leading-relaxed">
          {item.description}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Offline indicator */}
      {isUsingCache && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-sm text-amber-800">
            <WifiOff className="h-4 w-4" />
            <span>
              {!isOnline ? "Offline mode" : "Using cached data"} 
              {getCacheAge() && ` • Updated ${getCacheAge()}`}
            </span>
          </div>
        </div>
      )}

      {/* Elegant Menu Header */}
      <div className="relative bg-gradient-to-b from-amber-950 via-amber-900 to-amber-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 py-10 text-center">
          {/* Decorative top element */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-amber-400/60" />
              <div className="w-2 h-2 rotate-45 border border-amber-400/60" />
              <div className="h-px w-8 bg-amber-400/60" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wider mb-2">
            {displayTenant.name}
          </h1>
          
          {displayTable && (
            <p className="text-amber-200/80 text-sm tracking-widest uppercase mt-3">
              Table {displayTable.table_number} • {displayTable.location}
            </p>
          )}
          
          {/* Decorative bottom element */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
              <UtensilsCrossed className="h-5 w-5 text-amber-400/80" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Menu border decoration */}
        <div className="relative border-2 border-amber-200/60 rounded-sm p-6 sm:p-8 bg-white/50 shadow-sm">
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/50" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/50" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/50" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/50" />

          {displayCategories && displayCategories.length > 0 ? (
            <>
              {displayCategories.map((category, index) => {
                const items = getItemsByCategory(category.id);
                if (items.length === 0) return null;

                return (
                  <div key={category.id}>
                    {index > 0 && <DecorativeDivider />}
                    <CategoryDivider title={category.name} description={category.description} />
                    <div className="space-y-1">
                      {items.map((item) => (
                        <MenuItemRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Uncategorized items */}
              {uncategorizedItems.length > 0 && (
                <>
                  {displayCategories.length > 0 && <DecorativeDivider />}
                  <CategoryDivider title="Specials" />
                  <div className="space-y-1">
                    {uncategorizedItems.map((item) => (
                      <MenuItemRow key={item.id} item={item} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <UtensilsCrossed className="h-16 w-16 mx-auto text-amber-400/60 mb-4" />
              <p className="text-amber-700/70 font-serif italic text-lg">
                Our menu is being prepared...
              </p>
              <p className="text-amber-600/50 text-sm mt-2">
                Please check back soon
              </p>
            </div>
          )}

          {/* Menu footer decoration */}
          <div className="mt-10 pt-6 border-t border-amber-200/40">
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-amber-300/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                <div className="h-px w-8 bg-amber-300/40" />
              </div>
            </div>
            <p className="text-center text-xs text-amber-600/50 mt-4 tracking-widest uppercase">
              Thank you for dining with us
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-amber-700/40 tracking-wider">
          Powered by Kabit POS
        </p>
      </div>
    </div>
  );
};

export default PublicMenu;
