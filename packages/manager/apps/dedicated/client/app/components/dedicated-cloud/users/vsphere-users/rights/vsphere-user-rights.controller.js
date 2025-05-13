import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';

import {
  USER_IDENTITY_PROVIDER_IAM,
  USER_TYPE_USER,
  USER_TYPE_ROLE,
} from '../vsphere-users.constant';

export default class {
  /* @ngInject */
  constructor(DedicatedCloud) {
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.selectedUser = null;
    this.loading = {
      init: true,
    };

    return this.DedicatedCloud.getUserDetail(this.productId, this.userId)
      .then((user) => {
        const [userName, domain] = user.login.split('@');
        set(user, 'loginUsername', userName);
        set(user, 'loginDomain', domain);
        let userType = user.type || USER_TYPE_USER;
        if (
          has(user, 'identityProviderType') &&
          user.identityProviderType === USER_IDENTITY_PROVIDER_IAM
        ) {
          userType = USER_TYPE_ROLE;
        }
        set(user, 'userType', userType);
        this.selectedUser = user;
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  loadUserRights({ offset, pageSize }) {
    return this.DedicatedCloud.getUserRights(
      this.productId,
      this.userId,
      pageSize,
      offset - 1,
    ).then((results) => ({
      data: get(results, 'list.results'),
      meta: {
        totalCount: results.count,
      },
    }));
  }
}
