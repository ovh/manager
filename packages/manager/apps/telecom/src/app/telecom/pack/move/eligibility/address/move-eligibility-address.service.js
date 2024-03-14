export default class MoveEligibilityAddressService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  searchStreetNumber(streetCode) {
    return this.$http
      .post('/connectivity/eligibility/search/streetNumbers/details', {
        streetCode,
      })
      .then(({ data }) => data);
  }

  searchBuildings(hexacle, streetCode, streetNumber) {
    return this.$http
      .post('/connectivity/eligibility/search/buildings ', {
        hexacle,
        streetCode,
        streetNumber,
      })
      .then(({ data }) => data);
  }
}
