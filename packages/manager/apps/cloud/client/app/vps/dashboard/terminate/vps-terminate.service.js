export default class VpsTerminate {
  /* @ngInject */
  constructor(OvhApiVps) {
    this.OvhApiVps = OvhApiVps;
  }

  confirm(serviceName) {
    return this.OvhApiVps.v6().terminate({
      serviceName,
    }).$promise;
  }
}
