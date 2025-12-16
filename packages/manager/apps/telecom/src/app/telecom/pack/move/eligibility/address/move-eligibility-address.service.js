export default class MoveEligibilityAddressService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  searchStreetNumber(streetCode, streetAltCode) {
    return this.$http
      .post('/connectivity/eligibility/search/streetNumbers/details', {
        streetCode,
        streetAltCode,
      })
      .then(({ data }) => data);
  }

  searchBuildings(hexacle, streetAltCode, streetCode, streetNumber) {
    return this.$http
      .post('/connectivity/eligibility/search/buildings', {
        hexacle,
        streetCode,
        streetNumber,
        streetAltCode,
      })
      .then(({ data }) => data);
  }

  testAddress(hexacle, streetAltCode, streetCode, streetNumber, isReseller) {
    let url = '/connectivity/eligibility/test/address';
    if (isReseller) {
      url = '/connectivity/eligibility/test/address/partners';
    }
    return this.$http
      .post(url, {
        hexacle,
        streetAltCode,
        streetCode,
        streetNumber,
      })
      .then(({ data }) => data);
  }
}
