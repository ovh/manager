import { filter, groupBy } from 'lodash-es';

export default class hubCatalogItemsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCatalogItems() {
    return this.$http
      .get('/hub/catalog', {
        serviceType: 'aapi',
      })
      .then((data) => {
        const { catalog } = data.data.data;
        return groupBy(
          filter(catalog.data, ({ highlight }) => highlight),
          'universe',
        );
      });
  }
}
