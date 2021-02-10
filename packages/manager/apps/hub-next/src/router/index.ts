import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      relatedTranslations: [
        'preload-welcome',
        'products',
        'payment-status-tile',
        'order-tracking',
        'enterprise-billing-summary',
        'catalog-items',
        'carousel',
        'billing',
        'billing-summary',
        'support',
        'welcome',
        'ovh-order-tracking',
      ],
    },
  },
  {
    path: '/product-details',
    name: 'ProductDetails',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ProductDetails.vue'),
    query: {
      productApiUrl: '',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
