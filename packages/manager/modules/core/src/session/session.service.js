import { User } from '@ovh-ux/manager-models';

export default class SessionService {
  /* @ngInject */
  constructor($q, coreConfig) {
    this.$q = $q;
    this.coreConfig = coreConfig;
  }

  getUser() {
    const user = this.coreConfig.getUser();
    return this.$q.resolve(
      new User(
        {
          ...user,
          firstName: user.firstname,
          lastName: user.name,
          billingCountry: user.country,
        },
        user.certificates,
      ),
    );
  }
}
