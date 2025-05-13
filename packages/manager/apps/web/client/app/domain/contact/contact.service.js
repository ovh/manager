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

  postDomainConfigurationRuleCheck(action, domain, params) {
    return this.$http
      .post(
        `/domain/configurationRule/check?action=${action}&domain=${domain}`,
        params,
      )
      .then(({ data }) => data);
  }

  putDomainContact(contactId, params) {
    return this.$http
      .put(`/domain/contact/${contactId}`, params)
      .then(({ data }) => data);
  }
}
