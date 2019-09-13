export default class {
  /* @ngInject */
  constructor($q, OvhApiMe, OvhApiUniverses) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiUniverses = OvhApiUniverses;
  }

  getUser() {
    return this.$q.all({
      user: this.OvhApiMe.v6().get().$promise,
      certificates: this.OvhApiMe.v6().certificates().$promise,
    }).then(({ user, certificates }) => Object.assign(user, {
      isEnterprise: certificates.includes('enterprise'),
    }));
  }

  getSupportLevel() {
    return this.OvhApiMe.v6().supportLevel().$promise
      .catch(() => Promise.resolve(null));
  }

  getUniverses(version) {
    return this.OvhApiUniverses.Aapi().query({
      version,
    }).$promise;
  }
}
