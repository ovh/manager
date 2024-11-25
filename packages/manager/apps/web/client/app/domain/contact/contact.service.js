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

  getDomainConfigurationRule(action, domain) {
    return this.$http
      .get(`/domain/configurationRule?action=${action}&domain=${domain}`)
      .then(({ data }) => data);
  }

  postDomainConfigurationRule(action, domain) {
    return this.$http
      .post(`/domain/configurationRule?action=${action}&domain=${domain}`)
      .then(({ data }) => data);
  }

  putDomainContact(contactId, data) {
    return this.$http
      .post(`/domain/contact/${contactId}`, data)
      .then(({ data }) => data);
  }

}
