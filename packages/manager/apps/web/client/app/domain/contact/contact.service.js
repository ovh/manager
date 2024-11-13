export default class ContactService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getServiceInfos(serviceName) {
    return this.$http
      .get(`/domain/${serviceName}/serviceInfos`)
      .then(({ data }) => data);
  }
}
