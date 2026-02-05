import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  unit_price: number;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
}

interface MenuData {
  tenant: { name: string };
  categories: Category[];
  menuItems: MenuItem[];
  table?: { table_number: string; location: string | null };
}

export async function fetchMenuData(tenantId: string, tableId?: string): Promise<MenuData | null> {
  const [tenantRes, categoriesRes, menuRes, tableRes] = await Promise.all([
    supabase.from('tenants').select('name').eq('id', tenantId).maybeSingle(),
    supabase.from('menu_categories').select('*').eq('tenant_id', tenantId).eq('is_active', true).order('display_order'),
    supabase.from('products').select('id, name, description, unit_price, category_id').eq('tenant_id', tenantId).eq('is_active', true).order('name'),
    tableId ? supabase.from('restaurant_tables').select('table_number, location').eq('id', tableId).maybeSingle() : null,
  ]);

  if (tenantRes.error || !tenantRes.data) return null;

  return {
    tenant: tenantRes.data,
    categories: (categoriesRes.data || []) as Category[],
    menuItems: (menuRes.data || []) as MenuItem[],
    table: tableRes?.data || undefined,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', { maximumFractionDigits: 0 }).format(amount);
}

export function generateOfflineMenuHTML(data: MenuData): string {
  const { tenant, categories, menuItems, table } = data;

  const getItemsByCategory = (categoryId: string) => 
    menuItems.filter(item => item.category_id === categoryId);
  
  const uncategorizedItems = menuItems.filter(item => !item.category_id);

  const generateCategorySection = (category: Category) => {
    const items = getItemsByCategory(category.id);
    if (items.length === 0) return '';

    return `
      <div class="category-section">
        <div class="category-header">
          <div class="category-line"></div>
          <h2 class="category-title">${category.name}</h2>
          <div class="category-line"></div>
        </div>
        ${category.description ? `<p class="category-desc">${category.description}</p>` : ''}
        <div class="menu-items">
          ${items.map(item => `
            <div class="menu-item">
              <div class="item-row">
                <span class="item-name">${item.name}</span>
                <span class="item-dots"></span>
                <span class="item-price">UGX ${formatCurrency(item.unit_price)}</span>
              </div>
              ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  const categorySections = categories.map(generateCategorySection).join(`
    <div class="divider">
      <div class="divider-line"></div>
      <span class="divider-icon">✦</span>
      <div class="divider-line"></div>
    </div>
  `);

  const uncategorizedSection = uncategorizedItems.length > 0 ? `
    ${categories.length > 0 ? `
      <div class="divider">
        <div class="divider-line"></div>
        <span class="divider-icon">✦</span>
        <div class="divider-line"></div>
      </div>
    ` : ''}
    <div class="category-section">
      <div class="category-header">
        <div class="category-line"></div>
        <h2 class="category-title">Specials</h2>
        <div class="category-line"></div>
      </div>
      <div class="menu-items">
        ${uncategorizedItems.map(item => `
          <div class="menu-item">
            <div class="item-row">
              <span class="item-name">${item.name}</span>
              <span class="item-dots"></span>
              <span class="item-price">UGX ${formatCurrency(item.unit_price)}</span>
            </div>
            ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const noItemsMessage = menuItems.length === 0 ? `
    <div class="no-items">
      <div class="no-items-icon">🍽️</div>
      <p>Our menu is being prepared...</p>
      <p class="small">Please check back soon</p>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tenant.name} - Menu</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: #faf8f5;
      color: #451a03;
      min-height: 100vh;
    }

    /* Header */
    .header {
      background: linear-gradient(to bottom, #1c1917, #78350f);
      color: white;
      text-align: center;
      padding: 2.5rem 1.5rem;
      position: relative;
    }

    .header::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
    }

    .header-content { position: relative; }
    
    .header-decor {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .header-line { height: 1px; width: 2rem; background: rgba(251, 191, 36, 0.6); }
    .header-diamond { width: 0.5rem; height: 0.5rem; border: 1px solid rgba(251, 191, 36, 0.6); transform: rotate(45deg); }

    h1 {
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }

    .table-info {
      color: rgba(254, 243, 199, 0.8);
      font-size: 0.875rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .header-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .header-icon { font-size: 1.25rem; color: rgba(251, 191, 36, 0.8); }

    /* Menu Container */
    .menu-container {
      max-width: 40rem;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .menu-frame {
      border: 2px solid rgba(217, 119, 6, 0.3);
      border-radius: 2px;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.5);
      position: relative;
    }

    /* Corner decorations */
    .corner { position: absolute; width: 1rem; height: 1rem; }
    .corner-tl { top: 0.5rem; left: 0.5rem; border-top: 2px solid rgba(251, 191, 36, 0.5); border-left: 2px solid rgba(251, 191, 36, 0.5); }
    .corner-tr { top: 0.5rem; right: 0.5rem; border-top: 2px solid rgba(251, 191, 36, 0.5); border-right: 2px solid rgba(251, 191, 36, 0.5); }
    .corner-bl { bottom: 0.5rem; left: 0.5rem; border-bottom: 2px solid rgba(251, 191, 36, 0.5); border-left: 2px solid rgba(251, 191, 36, 0.5); }
    .corner-br { bottom: 0.5rem; right: 0.5rem; border-bottom: 2px solid rgba(251, 191, 36, 0.5); border-right: 2px solid rgba(251, 191, 36, 0.5); }

    /* Category */
    .category-section { margin-bottom: 1.5rem; }
    
    .category-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .category-line {
      height: 1px;
      width: 4rem;
      background: linear-gradient(to right, transparent, rgba(251, 191, 36, 0.6));
    }

    .category-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #78350f;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .category-desc {
      text-align: center;
      font-size: 0.875rem;
      color: rgba(120, 53, 15, 0.6);
      font-style: italic;
      margin-bottom: 1rem;
    }

    /* Menu Items */
    .menu-items { margin-top: 1rem; }

    .menu-item {
      padding: 0.75rem 0;
    }

    .item-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .item-name {
      font-size: 1rem;
      font-weight: 500;
      color: #1c1917;
    }

    .item-dots {
      flex: 1;
      border-bottom: 1px dotted rgba(217, 119, 6, 0.4);
      margin: 0 0.5rem 0.25rem;
    }

    .item-price {
      font-weight: 600;
      color: #92400e;
      white-space: nowrap;
    }

    .item-desc {
      font-size: 0.875rem;
      color: rgba(120, 53, 15, 0.7);
      font-style: italic;
      margin-top: 0.25rem;
      padding-left: 0.25rem;
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin: 1.5rem 0;
    }

    .divider-line {
      height: 1px;
      width: 3rem;
      background: linear-gradient(to right, transparent, rgba(251, 191, 36, 0.6));
    }

    .divider-icon { color: #d97706; font-size: 0.75rem; }

    /* No items */
    .no-items {
      text-align: center;
      padding: 4rem 0;
      color: rgba(120, 53, 15, 0.7);
    }

    .no-items-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
    .no-items p { font-style: italic; font-size: 1.125rem; }
    .no-items .small { font-size: 0.875rem; margin-top: 0.5rem; }

    /* Footer */
    .menu-footer {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(217, 119, 6, 0.2);
      text-align: center;
    }

    .footer-decor {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .footer-line { height: 1px; width: 2rem; background: rgba(217, 119, 6, 0.3); }
    .footer-dot { width: 0.375rem; height: 0.375rem; border-radius: 50%; background: rgba(251, 191, 36, 0.6); }

    .thanks {
      font-size: 0.75rem;
      color: rgba(217, 119, 6, 0.5);
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    .app-footer {
      text-align: center;
      padding: 1.5rem;
    }

    .app-footer p {
      font-size: 0.75rem;
      color: rgba(180, 83, 9, 0.4);
      letter-spacing: 0.1em;
    }

    /* Offline notice */
    .offline-notice {
      background: #fef3c7;
      border-bottom: 1px solid #fcd34d;
      padding: 0.5rem 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: #92400e;
    }

    .generated-date {
      font-size: 0.75rem;
      color: rgba(180, 83, 9, 0.5);
      text-align: center;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="offline-notice">
    📱 Offline Menu • Generated ${new Date().toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}
  </div>

  <header class="header">
    <div class="header-content">
      <div class="header-decor">
        <div class="header-line"></div>
        <div class="header-diamond"></div>
        <div class="header-line"></div>
      </div>
      <h1>${tenant.name}</h1>
      ${table ? `<p class="table-info">Table ${table.table_number} • ${table.location || ''}</p>` : ''}
      <div class="header-bottom">
        <div class="header-line"></div>
        <span class="header-icon">🍽️</span>
        <div class="header-line"></div>
      </div>
    </div>
  </header>

  <main class="menu-container">
    <div class="menu-frame">
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>

      ${noItemsMessage || categorySections + uncategorizedSection}

      <div class="menu-footer">
        <div class="footer-decor">
          <div class="footer-line"></div>
          <div class="footer-dot"></div>
          <div class="footer-line"></div>
        </div>
        <p class="thanks">Thank you for dining with us</p>
      </div>
    </div>
    
    <p class="generated-date">Menu prices may have changed since this was generated</p>
  </main>

  <footer class="app-footer">
    <p>Powered by Kabit POS</p>
  </footer>
</body>
</html>`;
}

export function downloadOfflineMenu(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
