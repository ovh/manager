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
      })
      .$promise.then((rmas) => {
        if (rmas.length > 0) {
          return rmas;
        }
        return null;
      });
  }
}
