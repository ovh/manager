import { User } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($q, coreConfig, OvhApiUniverses) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.OvhApiUniverses = OvhApiUniverses;
  }

  getUser() {
    return this.$q.resolve(
      new User(
        this.coreConfig.getUser(),
        this.coreConfig.getUser().certificates,
      ),
    );
  }

  getSupportLevel() {
    return this.$q.resolve(this.coreConfig.getUser().supportLevel);
  }

  getUniverses(version) {
    return this.OvhApiUniverses.Aapi().query({
      version,
    }).$promise;
  }
}
