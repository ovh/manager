import set from 'lodash/set';
import has from 'lodash/has';

import {
  DEFAULT_FILTER_COLUMN,
  ENUM_USERS_STATUS,
  IAM_STATUS_ENABLED,
  USER_IDENTITY_PROVIDER_IAM,
  USER_TYPE_USER,
  USER_TYPE_ROLE,
  SORT_ORDER,
} from './vsphere-users.constant';

export default class DedicatedCloudVsphereUsersCtrl {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud, ouiDatagridService) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    return this.$q
      .all({
        iamStatus: this.DedicatedCloud.getIamStatus(this.productId),
        policy: this.DedicatedCloud.getPasswordPolicy(this.productId),
      })
      .then((response) => {
        this.iamEnabled = response.iamStatus?.state === IAM_STATUS_ENABLED;
        this.passwordPolicy = response.policy;
      })
      .catch((err) => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_USER_edit_load_error',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }

  refreshUsersGrid() {
    return this.ouiDatagridService.refresh('pcc-user-datagrid', true);
  }

  loadUsers({ offset, pageSize, sort, criteria }) {
    const defaultFilterColumn = DEFAULT_FILTER_COLUMN;
    const filters = DedicatedCloudVsphereUsersCtrl.criteriaMap(
      criteria,
      defaultFilterColumn,
    );
    const params = {
      offset,
      pageSize,
      sort: sort.property,
      sortOrder: SORT_ORDER[sort.dir],
      filters,
      defaultFilterColumn,
    };

    return this.DedicatedCloud.getUserDetails(this.productId, params).then(
      ({ data: users, meta }) => {
        const userFormat = users.map((user) => {
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
          return user;
        });
        return {
          data: userFormat,
          meta,
        };
      },
    );
  }

  static criteriaMap(criteria, defaultFilterColumn) {
    return criteria.map((filter) => ({
      field: filter.property || defaultFilterColumn,
      comparator: filter.operator,
      reference: [filter.value],
    }));
  }

  getUsersStateEnumFilter() {
    const states = ENUM_USERS_STATUS;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      set(
        filter.values,
        state,
        this.$translate.instant(`dedicatedCloud_USER_state_${state}`),
      );
    });

    return filter;
  }

  onAddUserClick() {
    this.trackClick('add');
    return this.addUser(this.passwordPolicy);
  }

  onGoToUserIamRoleClick() {
    this.trackClick('iam');
    return this.goToUserIamRole();
  }
}
