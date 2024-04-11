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
      .get(`/telephony/${billingAccount}/line/${serviceName}/devices/beta`)
      .then(({ data }) => data.softphone);
  }

  handleToggleBeta(billingAccount, serviceName, softphone) {
    return this.$http
      .put(`/telephony/${billingAccount}/line/${serviceName}/devices/beta`, {
        softphone,
      })
      .then(({ data }) => data);
  }
}
