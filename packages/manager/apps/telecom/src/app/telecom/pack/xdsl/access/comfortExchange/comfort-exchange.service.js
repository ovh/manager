export default class XdslAccessComfortExchangeService {
  /* @ngInject */
  constructor(OvhApiXdsl) {
    this.OvhApiXdsl = OvhApiXdsl;
  }

  getOpenedRMAs(xdslId) {
    return this.OvhApiXdsl.RMA()
      .v6()
      .query({
        xdslId,
      }).$promise;
  }
}
