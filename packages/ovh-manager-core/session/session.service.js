export default class SessionService {
  constructor(OvhApiMe) {
    'ngInject';

    this.OvhApiMe = OvhApiMe.v6();
  }

  getUser() {
    return this.OvhApiMe.get().$promise;
  }
}
