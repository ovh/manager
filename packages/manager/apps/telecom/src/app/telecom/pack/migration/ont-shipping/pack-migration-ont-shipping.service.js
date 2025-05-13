export default class PackMigrationOntShippingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getShippingAddresses(packName, context) {
    return this.$http.get(
      `/pack/xdsl/${packName}/shippingAddresses?context=${context}`,
    );
  }
}
