import set from 'lodash/set';

import {
  DEFAULT_FILTER_COLUMN,
  ENUM_USERS_STATUS,
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
        federationStatus: this.DedicatedCloud.getFederationStatus(
          this.productId,
        ),
        policy: this.DedicatedCloud.getPasswordPolicy(this.productId),
        nsxOptions: this.DedicatedCloud.getOptionState('nsx', this.productId),
      })
      .then((response) => {
        this.federationEnabled = response.federationStatus?.state === 'enabled';
        this.passwordPolicy = response.policy;
        this.nsxOptions = response.nsxOptions;
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
          set(user, 'loginUsername', user.login.split('@')[0]);
          set(user, 'loginDomain', user.login.split('@')[1]);
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

  canDeleteUserOrGroup(row) {
    return (
      this.dedicatedCloud.solution !== 'SYSTEMCENTER' ||
      (this.dedicatedCloud.solution === 'SYSTEMCENTER' &&
        row.name !== 'infraadmin')
    );
  }

  onAddUserClick() {
    this.trackClick('add');
    return this.addUser(this.passwordPolicy);
  }

  onGoToImportUserClick() {
    this.trackClick('import');
    return this.goToImportUser();
  }
}
