export default class OverTheBoxMigrationSummaryService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getOfferTargetDetail(serviceName, offer, hardware, shippingContactID) {
    return this.$http.get(`/order/overTheBox/${serviceName}/migrate`, {
      params: {
        offer,
        hardware,
        ...(shippingContactID && { shippingContactID }),
      },
    });
  }

  migrateOffer(serviceName, offer, hardwareName, shippingContactID) {
    const params = {
      offer,
      ...(hardwareName && { hardwareName }),
      ...(shippingContactID && { shippingContactID }),
    };
    return this.$http.post(
      `/overTheBox/${serviceName}/migration/changeOffers`,
      params,
    );
  }
}
