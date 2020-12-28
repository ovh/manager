import { User } from '@ovh-ux/manager-models';
import { Environment } from '@ovh-ux/manager-config';

export default class {
  /* @ngInject */
  constructor($q, OvhApiUniverses) {
    this.$q = $q;
    this.OvhApiUniverses = OvhApiUniverses;
  }

  getUser() {
    return this.$q.resolve(
      new User(Environment.getUser(), Environment.getUser().certificates),
    );
  }

  getSupportLevel() {
    return this.$q.resolve(Environment.getUser().supportLevel);
  }

  getUniverses(version) {
    return this.OvhApiUniverses.Aapi().query({
      version,
    }).$promise;
  }
}
