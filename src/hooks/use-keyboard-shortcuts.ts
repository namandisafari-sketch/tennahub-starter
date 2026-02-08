import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface ShortcutConfig {
  key: string;
  route: string;
  description: string;
}

const schoolShortcuts: ShortcutConfig[] = [
  { key: "s", route: "/business/students", description: "Students" },
  { key: "c", route: "/business/classes", description: "Classes" },
  { key: "g", route: "/business/grades", description: "Grades" },
  { key: "a", route: "/business/attendance", description: "Attendance" },
  { key: "p", route: "/business/parents", description: "Parents" },
  { key: "t", route: "/business/staff", description: "Staff" },
  { key: "r", route: "/business/report-cards", description: "Report Cards" },
  { key: "e", route: "/business/exams", description: "Exams" },
  { key: "d", route: "/business", description: "Dashboard" },
];

const restaurantShortcuts: ShortcutConfig[] = [
  { key: "p", route: "/business/pos", description: "POS" },
  { key: "k", route: "/business/kitchen", description: "Kitchen Display" },
  { key: "m", route: "/business/menu", description: "Menu" },
  { key: "t", route: "/business/tables", description: "Tables" },
  { key: "d", route: "/business", description: "Dashboard" },
];

const retailShortcuts: ShortcutConfig[] = [
  { key: "p", route: "/business/pos", description: "POS" },
  { key: "i", route: "/business/inventory", description: "Inventory" },
  { key: "c", route: "/business/customers", description: "Customers" },
  { key: "s", route: "/business/sales", description: "Sales" },
  { key: "d", route: "/business", description: "Dashboard" },
];

export function useKeyboardShortcuts(businessType: string) {
  const navigate = useNavigate();

  const getShortcuts = useCallback(() => {
    if (businessType.includes("school") || businessType === "kindergarten" || businessType === "primary_school" || businessType === "secondary_school") {
      return schoolShortcuts;
    }
    if (businessType === "restaurant" || businessType === "cafe") {
      return restaurantShortcuts;
    }
    return retailShortcuts;
  }, [businessType]);

  useEffect(() => {
    const shortcuts = getShortcuts();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt key is held (Alt+Key for navigation)
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      const key = e.key.toLowerCase();
      const shortcut = shortcuts.find(s => s.key === key);
      
      if (shortcut) {
        e.preventDefault();
        navigate(shortcut.route);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [getShortcuts, navigate]);

  return { shortcuts: getShortcuts() };
}
