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

  getDomainContactInformations(contactId) {
    return this.$http
      .get(`/domain/contact/${contactId}`)
      .then(({ data }) => data);
  }

}
