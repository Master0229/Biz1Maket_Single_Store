export const getMenuData: any[] = [
  {
    category: true,
    title: 'BizDom',
  },
  // {
  //   title: 'Dashboards',
  //   key: 'dashboards',
  //   icon: 'fa fa-area-chart',
  //   url: '/dashboard/alpha',
  // },
  {
    title: 'Dashboard',
    key: 'dashboard',
    icon: 'fa fa-area-chart',
    url: '/apps/dashboard',
  },
  {
    title: 'Sale',
    key: 'appsProfile',
    icon: 'fe fe-shopping-cart',
    url: '/apps/sale',
  },
  {
    title: 'Receipts',
    icon: 'fa fa-pencil-square-o',
    key: 'appsSetting',
    url: '/apps/receipt',
  },
  // {
  //   title: 'Orders',
  //   icon: 'fa fa-server',
  //   key: 'ecommerceOrders',
  //   url: '/ecommerce/orders',
  // },
  // {
  //   title: 'Batch Entry',
  //   icon: 'fa fa-stack-overflow',
  //   key: 'appsBatchEntry',
  //   url: '/apps/batchentry',
  // },
  // {
  //   title: 'Stock Entry',
  //   icon: 'fa fa-th-large',
  //   key: 'appsStockEntry',
  //   url: '/apps/stockentry',
  // },
  {
    title: 'Customers',
    key: 'appsSetting',
    icon: 'fe fe-users',
    url: '/apps/customer',
  },
  // {
  //   title: 'Internal Transfer',
  //   key: 'appsInternalTransfer',
  //   icon: 'fa fa-code-fork',
  //   url: '/apps/internaltransfer',
  // },
  {
    title: 'Add Stock',
    key: 'appsBatchEntry',
    icon: 'fe fe-layers',
    url: '/apps/batchentry',
  },
  {
    title: 'Product',
    key: 'appsProfile',
    icon: 'fe fe-grid',
    url: '/apps/products',
  },
  // {
  //   title: 'Variant',
  //   key: 'appsProductOptions',
  //   icon : 'fe fe-copy',
  //   url: '/apps/productoptions',
  // },
  {
    title: 'Category',
    key: 'appsProfile',
    icon: 'fa fa-sitemap',
    url: '/apps/category',
  },
  {
    title: 'TaxGroup',
    key: 'appsSetting',
    icon: 'fa fa-calculator',
    url: '/apps/taxgroup',
  },
  {
    title: 'Purchase Entry',
    key: 'appsSetting',
    icon: 'fe fe-shopping-bag',
    url: '/apps/purchaseentry',
  },
  {
    title: 'Wanted',
    key: 'appsaddproduct',
    icon: 'fa fa-object-group',
    url: '/apps/addproduct',
  },
  // {
  //   title: 'Vendors',
  //   key: 'appsSetting',
  //   icon: 'fe fe-user-check',
  //   url: '/apps/vendors',
  // },
  {
    title: 'Setting',
    key: 'appsSetting',
    icon: 'fa fa-cogs',
    url: '/apps/setting',
  },

  // {
  //   title: 'Dashboards',
  //   key: 'dashboards',
  //   icon: 'fe fe-home',
  //   // roles: ['admin'], // set user roles with access to this route
  //   // count: 4,
  //   children: [
  //     {
  //       title: 'Dashboard Alpha',
  //       key: 'dashboard',
  //       url: '/dashboard/alpha',
  //     },
  //     {
  //       title: 'Dashboard Beta',
  //       key: 'dashboardBeta',
  //       url: '/dashboard/beta',
  //     },
  //     {
  //       title: 'Dashboard Gamma',
  //       key: 'dashboardGamma',
  //       url: '/dashboard/gamma',
  //     },
  //     {
  //       title: 'Crypto Terminal',
  //       key: 'dashboardCrypto',
  //       url: '/dashboard/crypto',
  //     },
  // ],
  // },
  // {
  //   category: true,
  //   title: 'BizDom',
  // },
  // {
  //   title: 'Sale',
  //   key: 'appsProfile',
  //   icon:'fe fe-shopping-cart',
  //   url: '/apps/sale',
  // },
  // {
  //   category: true,
  //   title: 'Website',
  // },
  // {
  //   title: 'Product',
  //   key: 'appsProfile',
  //   icon: 'fe fe-grid',
  //   url: '/apps/products',
  // },
  // {
  //   title: 'Category',
  //   key: 'appsProfile',
  //   icon: 'fa fa-sitemap',
  //   url: '/apps/category',
  // },

  // // {
  // //   title: 'Receipt',
  // //   key: 'appsSetting',
  // //   icon:'fe fe-book-open',
  // //   url: '/apps/receipt',
  // // },

  // {
  //   title: 'TaxGroup',
  //   key: 'appsSetting',
  //   icon: 'fa fa-calculator',
  //   url: '/apps/taxgroup',
  // },
  // // {
  // //   title: 'Setting',
  // //   key: 'appsSetting',
  // //   icon:'fe fe-sliders',
  // //   url: '/apps/setting',
  // // },
  // {
  //   title: 'Batch Entry',
  //   icon: 'fa fa-stack-overflow',
  //   key: 'appsBatchEntry',
  //   url: '/apps/batchentry',
  // },
  // {
  //   title: 'Vendors',
  //   key: 'appsSetting',
  //   icon: 'fe fe-user-check',
  //   url: '/apps/vendors',
  // },

  // {
  //   title: 'ProductOptions',
  //   icon: 'fa fa-object-group',
  //   key: 'appsProductOptions',
  //   url: '/apps/productoptions',
  // },
  // {
  //   title: 'Internal Transfer',
  //   key: 'apps',
  //   icon: 'fe fe-truck',
  //   children: [
  //     {
  //       title: 'Dispatch Items',
  //       key: 'appsDispatchItem',
  //       url: '/apps/DispatchItem',
  //     },
  //     {
  //       title: 'Dispatch Orders',
  //       key: 'appsDispatchOrders',
  //       url: '/apps/DispatchOrders',
  //     },
  //   ]
  // },
  // {
  //   title: 'Maintenance',
  //   key: 'apps',
  //   icon: 'fa fa-server',
  //   children: [
  //     {
  //       title: 'Assets',
  //       key: 'appsAssets',
  //       url: '/apps/asset',
  //     },
  //     {
  //       title: 'Asset Types',
  //       key: 'appsAssettypes',
  //       url: '/apps/assettypes',
  //     },
  //     {
  //       title: 'Maintainence Bill Types',
  //       key: 'appsMaintbilltypes',
  //       url: '/apps/maintainencebilltypes',
  //     },
  //   ]
  // },
  // {
  //   title: 'Master Data',
  //   key: 'apps',
  //   icon: 'fa fa-star',
  //   children: [

  //     {
  //       title: ' Location',
  //       key: 'appslocation',
  //       url: '/apps/location',
  //     },
  //     // {
  //     //   title: ' Bankaccount',
  //     //   key: 'appsBankaccount',
  //     //   url: '/apps/bankaccount',
  //     // }
  //   ],
  // },
  // {
  //   title: 'Finance',
  //   key: 'apps',
  //   icon: 'fa fa-credit-card',
  //   children: [
  //     {
  //       title: ' Location',
  //       key: 'appslocation',
  //       url: '/apps/location',
  //     },
  //     {
  //       title: ' Bankaccount',
  //       key: 'appsBankaccount',
  //       url: '/apps/bankaccount',
  //     },
  //     {
  //       title: 'Credit',
  //       key: 'appsCredit',
  //       url: '/apps/credit',
  //     },
  //     {
  //       title: 'Purchase/Maintainence',
  //       key: 'appsPurchaseMaint',
  //       url: '/apps/purchasemaint',
  //     },
  //     {
  //       title: 'Bills Pay byVendor',
  //       key: 'appsBillbyvendor',
  //       url: '/apps/billbyvendor',
  //     }
  //   ],
  // },
  // {
  //   title: 'Feedback',
  //   icon: 'fa fa-heart',
  //   key: 'extraAppsWordpressAdd',
  //   url: '/apps/wordpress-add',
  // },
  {
    title: 'Pricing Tables',
    key: 'pricingTables',
    icon: 'fe fe-command',
    url: '/advanced/pricing-tables',
  },
  // {
  //   title: 'About Us',
  //   icon: 'fe fe-alert-octagon',
  //   key: 'extraAppsHelpdeskDashboard',
  //   url: '/apps/helpdesk-dashboard',
  // },
  {
    // title: 'Setup',
    // key: 'apps',
    // icon: 'fe fe-settings',
    // children: [
    //   {
    //     title: 'Add Product',
    //     key: 'appsaddproduct',
    //     url: '/apps/addproduct',
    //   },
    //   // {
    //   //   title: 'StockEntry',
    //   //   key: 'appsStockEntry',
    //   //   url: '/apps/stockentry',
    //   // },
    //   // {
    //   //   title: 'InternalTransfer',
    //   //   key: 'appsInternalTransfer',
    //   //   url: '/apps/internaltransfer',
    //   // },
    //   // {
    //   //   title: 'ProductOptions',
    //   //   key: 'appsProductOptions',
    //   //   url: '/apps/productoptions',
    //   // },
    // ],
  },
  // {
  //   title: 'Apps',
  //   key: 'apps',
  //   icon: 'fe fe-database',
  //   children: [

  //     {
  //       title: 'Profile',
  //       key: 'appsProfile',
  //       url: '/apps/profile',
  //     },
  //     {
  //       title: 'Calendar',
  //       key: 'appsCalendar',
  //       url: '/apps/calendar',
  //     },
  //     {
  //       title: 'Gallery',
  //       key: 'appsGallery',
  //       url: '/apps/gallery',
  //     },
  //     {
  //       title: 'Messaging',
  //       key: 'appsCart',
  //       url: '/apps/messaging',
  //     },
  //     {
  //       title: 'Mail',
  //       key: 'appsMail',
  //       url: '/apps/mail',
  //     },
  //   ],
  // },
  // {
  //   title: 'Extra Apps',
  //   key: 'extraApps',
  //   icon: 'fe fe-hard-drive',
  //   children: [
  //     {
  //       title: 'Github Explore',
  //       key: 'extraAppsGithubExplore',
  //       url: '/apps/github-explore',
  //     },
  //     {
  //       title: 'Github Discuss',
  //       key: 'extraAppsGithubDiscuss',
  //       url: '/apps/github-discuss',
  //     },
  //     {
  //       title: 'Digitalocean Droplets',
  //       key: 'extraAppsDigitaloceanDroplets',
  //       url: '/apps/digitalocean-droplets',
  //     },
  //     {
  //       title: 'Digitalocean Create',
  //       key: 'extraAppsDigitaloceanCreate',
  //       url: '/apps/digitalocean-create',
  //     },
  //     {
  //       title: 'Google Analytics',
  //       key: 'extraAppsGoogleAnalytis',
  //       url: '/apps/google-analytics',
  //     },
  //     {
  //       title: 'Wordpress Post',
  //       key: 'extraAppsWordpressPost',
  //       url: '/apps/wordpress-post',
  //     },
  //     {
  //       title: 'Wordpress Posts',
  //       key: 'extraAppsWordpressPosts',
  //       url: '/apps/wordpress-posts',
  //     },
  //     {
  //       title: 'Wordpress Add',
  //       key: 'extraAppsWordpressAdd',
  //       url: '/apps/wordpress-add',
  //     },
  //     {
  //       title: 'Todoist List',
  //       key: 'extraAppsTodoistList',
  //       url: '/apps/todoist-list',
  //     },
  //     {
  //       title: 'Jira Dashboard',
  //       key: 'extraAppsJiraDashboard',
  //       url: '/apps/jira-dashboard',
  //     },
  //     {
  //       title: 'Jira Agile Board',
  //       key: 'extraAppsJiraAgileBoard',
  //       url: '/apps/jira-agile-board',
  //     },
  //     {
  //       title: 'Helpdesk Dashboard',
  //       key: 'extraAppsHelpdeskDashboard',
  //       url: '/apps/helpdesk-dashboard',
  //     },
  //   ],
  // },
  // {
  //   title: 'Ecommerce',
  //   key: 'ecommerce',
  //   icon: 'fe fe-shopping-cart',
  //   children: [
  //     {
  //       title: 'AddProduct',
  //       key: 'appsAddproduct',
  //       url: '/apps/addproduct',
  //     },
  // {
  //   title: 'BatchEntry',
  //   key: 'appsBatchEntry',
  //   url: '/apps/batchentry',
  // },
  //     {
  //       title: 'StockEntry',
  //       key: 'appsStockEntry',
  //       url: '/apps/stockentry',
  //     },
  //     {
  //       title: 'InternalTransfer',
  //       key: 'appsInternalTransfer',
  //       url: '/apps/internaltransfer',
  //     },
  //     {
  //       title: 'ProductOptions',
  //       key: 'appsProductOptions',
  //       url: '/apps/productoptions',
  //     },
  //     {
  //       title: 'Dashboard',
  //       key: 'ecommerceDashboard',
  //       url: '/ecommerce/dashboard',
  //     },

  //     {
  //       title: 'Propduct Catalog',
  //       key: 'ecommerceProductCatalog',
  //       url: '/ecommerce/product-catalog',
  //     },
  //     {
  //       title: 'Product Details',
  //       key: 'ecommerceProductDetails',
  //       url: '/ecommerce/product-details',
  //     },
  //     {
  //       title: 'Cart',
  //       key: 'ecommerceCart',
  //       url: '/ecommerce/cart',
  //     },
  //   ],
  // },
  // {
  //   title: 'Auth Pages',
  //   key: 'auth',
  //   icon: 'fe fe-user',
  //   children: [
  //     {
  //       title: 'Login',
  //       key: 'authLogin',
  //       url: '/auth/login',
  //     },
  //     {
  //       title: 'Forgot Password',
  //       key: 'authForgotPassword',
  //       url: '/auth/forgot-password',
  //     },
  //     {
  //       title: 'Register',
  //       key: 'authRegister',
  //       url: '/auth/register',
  //     },
  //     {
  //       title: 'Lockscreen',
  //       key: 'authLockscreen',
  //       url: '/auth/lockscreen',
  //     },
  //     {
  //       title: 'Lockscreen1',
  //       key: 'authLockscreen',
  //       url: '/auth/pinscreen',
  //     },
  //     {
  //       title: 'Page 404',
  //       key: 'auth404',
  //       url: '/auth/404',
  //     },
  //     {
  //       title: 'Page 500',
  //       key: 'auth500',
  //       url: '/auth/500',
  //     },
  //   ],
  // },
  // {
  //   category: true,
  //   title: 'UI Kits',
  // },
  // {
  //   title: 'Ant Design',
  //   key: 'antDesign',
  //   icon: 'fe fe-bookmark',
  //   url: '/ui-kits/antd',
  // },
  // {
  //   title: 'Bootstrap',
  //   key: 'bootstrap',
  //   icon: 'fe fe-bookmark',
  //   url: '/ui-kits/bootstrap',
  // },
  // {
  //   category: true,
  //   title: 'Components',
  // },
  // {
  //   title: 'Widgets',
  //   key: 'widgets',
  //   icon: 'fe fe-image',
  //   count: 47,
  //   children: [
  //     {
  //       title: 'General',
  //       key: 'widgetsGeneral',
  //       url: '/widgets/general',
  //     },
  //     {
  //       title: 'Lists',
  //       key: 'widgetsLists',
  //       url: '/widgets/lists',
  //     },
  //     {
  //       title: 'Tables',
  //       key: 'widgetsTables',
  //       url: '/widgets/tables',
  //     },
  //     {
  //       title: 'Charts',
  //       key: 'widgetsCharts',
  //       url: '/widgets/charts',
  //     },
  //   ],
  // },
  // {
  //   title: 'Cards',
  //   key: 'cards',
  //   icon: 'fe fe-credit-card',
  //   children: [
  //     {
  //       title: 'Basic Cards',
  //       key: 'cardsBasicCards',
  //       url: '/cards/basic-cards',
  //     },
  //     {
  //       title: 'Tabbed Cards',
  //       key: 'cardsTabbedCards',
  //       url: '/cards/tabbed-cards',
  //     },
  //   ],
  // },
  // {
  //   title: 'Tables',
  //   key: 'tables',
  //   icon: 'fe fe-grid',
  //   children: [
  //     {
  //       title: 'Ant Design',
  //       key: 'tablesAntd',
  //       url: '/tables/antd',
  //     },
  //     {
  //       title: 'Bootstrap',
  //       key: 'tablesBootstrap',
  //       url: '/tables/bootstrap',
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   key: 'charts',
  //   icon: 'fe fe-pie-chart',
  //   children: [
  //     {
  //       title: 'Chartist.js',
  //       key: 'chartsChartistjs',
  //       url: '/charts/chartistjs',
  //     },
  //     {
  //       title: 'Chart.js',
  //       key: 'chartsChartjs',
  //       url: '/charts/chartjs',
  //     },
  //     {
  //       title: 'C3',
  //       key: 'chartsC3',
  //       url: '/charts/c3',
  //     },
  //   ],
  // },
  // {
  //   title: 'Icons',
  //   key: 'icons',
  //   icon: 'fe fe-star',
  //   children: [
  //     {
  //       title: 'Feather Icons',
  //       key: 'iconsFeatherIcons',
  //       url: '/icons/feather-icons',
  //     },
  //     {
  //       title: 'Fontawesome',
  //       key: 'iconsFontawesome',
  //       url: '/icons/fontawesome',
  //     },
  //     {
  //       title: 'Linearicons Free',
  //       key: 'iconsLineariconsFree',
  //       url: '/icons/linearicons-free',
  //     },
  //     {
  //       title: 'Icomoon Free',
  //       key: 'iconsIcomoonFree',
  //       url: '/icons/icomoon-free',
  //     },
  //   ],
  // },
  // {
  //   category: true,
  //   title: 'Advanced',
  // },
  // {
  //   title: 'Form Examples',
  //   key: 'formExamples',
  //   icon: 'fe fe-menu',
  //   url: '/advanced/form-examples',
  // },
  // {
  //   title: 'Email Templates',
  //   key: 'emailTemplates',
  //   icon: 'fe fe-mail',
  //   url: '/advanced/email-templates',
  // },
  // {
  //   title: 'Pricing Tables',
  //   key: 'pricingTables',
  //   icon: 'fe fe-command',
  //   url: '/advanced/pricing-tables',
  // },
  // {
  //   title: 'Invoice',
  //   key: 'invoice',
  //   icon: 'fe fe-file-text',
  //   url: '/advanced/invoice',
  // },
  // {
  //   title: 'Utilities',
  //   key: 'utilities',
  //   icon: 'fe fe-inbox',
  //   url: '/advanced/utilities',
  // },
  // {
  //   title: 'Grid',
  //   key: 'grid',
  //   icon: 'fe fe-grid',
  //   url: '/advanced/grid',
  // },
  // {
  //   title: 'Typography',
  //   key: 'typography',
  //   icon: 'fe fe-type',
  //   url: '/advanced/typography',
  // },
  // {
  //   title: 'Colors',
  //   key: 'colors',
  //   icon: 'fe fe-feather',
  //   url: '/advanced/colors',
  // },
  // {
  //   title: 'Nested Items',
  //   key: 'nestedItem1',
  //   icon: 'fe fe-layers',
  //   children: [
  //     {
  //       title: 'Nested Item 1-1',
  //       key: 'nestedItem1-1',
  //       children: [
  //         {
  //           title: 'Nested Item 1-1-1',
  //           key: 'nestedItem1-1-1',
  //         },
  //         {
  //           title: 'Nested Items 1-1-2',
  //           key: 'nestedItem1-1-2',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Nested Items 1-2',
  //       key: 'nestedItem1-2',
  //     },
  //   ],
  // },
  // {
  //   title: 'Disabled Item',
  //   key: 'disabledItem',
  //   icon: 'fe fe-slash',
  //   disabled: true,
  // },
]
