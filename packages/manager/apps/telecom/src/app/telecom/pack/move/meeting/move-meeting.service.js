export default class MoveMeetingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  searchMeetings(eligibilityReference, productCode, installationType) {
    return this.$http.post(`/connectivity/eligibility/search/meetings`, {
      eligibilityReference,
      productCode,
      installationType,
    });
  }
}
