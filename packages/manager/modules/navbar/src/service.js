export default class {
  /* @ngInject */
  constructor(OvhApiMe, OvhApiUniverses) {
    this.OvhApiMe = OvhApiMe;
    this.OvhApiUniverses = OvhApiUniverses;
  }

  getUser() {
    return this.OvhApiMe.v6().get().$promise;
  }

  getUniverses() {
    return this.OvhApiUniverses.Aapi().query().$promise;
  }
}
