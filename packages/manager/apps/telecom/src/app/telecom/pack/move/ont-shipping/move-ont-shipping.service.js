export default class MoveOntShippingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getAddress(packName, context) {
    return this.$http.get(
      `/pack/xdsl/${packName}/shippingAddresses?context=${context}`,
    );
  }
}
