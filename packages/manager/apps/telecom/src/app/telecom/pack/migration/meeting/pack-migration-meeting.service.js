export default class PackMigrationMeetingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  searchMeetings(options) {
    return this.$http
      .post(`/connectivity/eligibility/search/meetings`, options)
      .then(({ data }) => data);
  }
}
