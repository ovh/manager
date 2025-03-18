export default class MoveMeetingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  searchMeetings(eligibilityReference, productCode, installationType) {
    const params = {
      eligibilityReference,
      productCode,
    };
    if (installationType) {
      params.installationType = installationType;
    }
    return this.$http
      .post(`/connectivity/eligibility/search/meetings`, params)
      .then(({ data }) => data);
  }
}
