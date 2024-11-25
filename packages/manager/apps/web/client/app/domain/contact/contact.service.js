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

  postDomainConfigurationRuleCheck(action, domain, data) {
    return this.$http
      .post(
        `/domain/configurationRule/check?action=${action}&domain=${domain}`,
        data,
      )
      .then(({ data }) => data);
  }

  putDomainContact(contactId, data) {
    return this.$http
      .put(`/domain/contact/${contactId}`, data)
      .then(({ data }) => data);
  }
}
