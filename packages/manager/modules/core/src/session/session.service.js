import { Environment } from '@ovh-ux/manager-config';
import { User } from '@ovh-ux/manager-models';

export default class SessionService {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;
  }

  getUser() {
    const user = Environment.getUser();
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
