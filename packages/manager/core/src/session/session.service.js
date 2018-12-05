export default class SessionService {
  /* @ngInject */

  constructor(OvhApiMe) {
    this.OvhApiMe = OvhApiMe.v6();
  }

  getUser() {
    return this.OvhApiMe.get().$promise;
  }
}
