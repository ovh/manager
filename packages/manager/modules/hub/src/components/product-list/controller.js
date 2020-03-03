// import find from 'lodash/find';
// import get from 'lodash/get';
// import keysIn from 'lodash/keysIn';
// import map from 'lodash/map';

// import { PRODUCTS } from './config';

// export default class ManagerHubBillingProductList {
//   /* @ngInject */
//   constructor($http, $translate) {
//     this.$http = $http;
//     this.$translate = $translate;
//   }

//   $onInit() {
//     if (!this.product) {
//       throw new Error('Missing required product attribute');
//     }
//     if (!get(PRODUCTS, this.product)) {
//       throw new Error(`Missing configuration for product '${this.product}'`);
//     }

//     this.isLoading = true;

//     this.route = get(PRODUCTS, `${this.product}.route`);
//     this.columns = get(PRODUCTS, `${this.product}.columns`);
//     this.columns = map(this.columns, (column) => ({
//       ...column,
//       title: this.$translate.instant(column.title),
//       filterable: 'filterable' in column ? column.filterable : true,
//       sortable: 'sortable' in column ? column.sortable : true,
//     }));

//     this.endpoint = this.route.replace(/\/\{[^}]+\}/, '');
//     [, this.resource] = this.route.match(/\{([^}]+)\}/);

//     return this.fetchProducts()
//       .then((products) => this.fetchProductsBilling(products))
//       .then((products) => {
//         this.products = products;
//         if (!this.columns) {
//           this.columns = map(keysIn(products[0]), (key) => ({
//             title: key,
//             property: key,
//             sortable: true,
//           }));
//         }
//       })
//       .finally(() => {
//         this.isLoading = false;
//       });
//   }

//   fetchProducts() {
//     return this.$http
//       .get(this.endpoint, {
//         headers: {
//           'X-Pagination-Mode': 'CachedObjectList-Pages',
//           'X-Pagination-Size': 50000,
//         },
//       })
//       .then(({ data }) => data);
//   }

//   fetchProductsBilling(products) {
//     return this.$http
//       .get('/services', {
//         params: {
//           routes: this.endpoint,
//         },
//         headers: {
//           'X-Pagination-Mode': 'CachedObjectList-Pages',
//           'X-Pagination-Size': 50000,
//         },
//       })
//       .then(({ data }) => data)
//       .then((services) => {
//         return map(products, (product) => {
//           const productId = get(product, this.resource);
//           const productService = find(services, (service) => {
//             return get(service, 'resource.name') === productId;
//           });
//           return {
//             ...product,
//             expirationDate: get(productService, 'billing.expirationDate'),
//           };
//         });
//       });
//   }
// }
