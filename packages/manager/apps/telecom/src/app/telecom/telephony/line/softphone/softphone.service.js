export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getsoftphoneBetaEligibility() {
    return this.$http
      .get('/telephony/softphoneBetaEligibility')
      .then(({ data }) => data.eligibility);
  }

  checkServiceIsBeta(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/softphone/beta`)
      .then(({ data }) => data.enabled);
  }

  handleToggleBeta(billingAccount, serviceName, softphone) {
    return this.$http
      .put(`/telephony/${billingAccount}/line/${serviceName}/devices/beta`, {
        softphone,
      })
      .then(({ data }) => data);
  }

  regenerateToken(billingAccount, serviceName) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/softphone/beta/regenerateToken`,
      )
      .then(({ data }) => data);
  }
}
