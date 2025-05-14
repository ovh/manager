export default class MoveMeetingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  searchMeetings(
    eligibilityReference,
    productCode,
    installationType,
    ptoReference,
  ) {
    const params = {
      eligibilityReference,
      productCode,
    };
    if (installationType) {
      params.installationType = installationType;
    }
    if (ptoReference) {
      params.otp = ptoReference;
    }
    return this.$http
      .post(`/connectivity/eligibility/search/meetings`, params)
      .then(({ data }) => data);
  }
}
