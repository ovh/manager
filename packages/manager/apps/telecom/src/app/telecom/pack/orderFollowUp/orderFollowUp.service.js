export default class OrderFollowUpService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getOrderFollowUp(packName) {
    return this.$http
      .get(`/pack/xdsl/${packName}/orderFollowUp`)
      .then(({ data }) => data);
  }
}
