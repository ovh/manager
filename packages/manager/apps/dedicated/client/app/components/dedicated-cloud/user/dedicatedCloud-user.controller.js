import set from 'lodash/set';

import {
  DEFAULT_FILTER_COLUMN,
  ENUM_ACTIVE_DIRECTORY_STATUS,
  SORT_ORDER,
} from './dedicatedCloud-user.constant';

export default class DedicatedCloudUserCtrl {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud, ouiDatagridService) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.usersEntrySearchSelected = null;
    this.loading = true;
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
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadUsers({ offset, pageSize }) {
    this.searchLoading = true;
    return this.DedicatedCloud.getUsers(
      this.productId,
      this.usersEntrySearchSelected,
    ).then((users) => {
      this.searchLoading = false;
      return {
        data: users
          .slice(offset - 1, offset - 1 + pageSize)
          .map((id) => ({ id })),
        meta: {
          totalCount: users.length,
        },
      };
    });
  }

  loadUser({ id }) {
    return this.DedicatedCloud.getUserDetail(this.productId, id).then(
      (user) => {
        set(user, 'state', user.state.toUpperCase());
        set(user, 'activationState', user.activationState.toUpperCase());
        set(user, 'loginUsername', user.login.split('@')[0]);
        set(user, 'loginDomain', user.login.split('@')[1]);
        return user;
      },
    );
  }

  refreshGrid() {
    return this.ouiDatagridService.refresh('pcc-user-datagrid', true);
  }

  loadActiveDirectories({ offset, pageSize, sort, criteria }) {
    const defaultFilterColumn = DEFAULT_FILTER_COLUMN.activeDirectories;
    const filters = DedicatedCloudUserCtrl.criteriaMap(
      criteria,
      defaultFilterColumn,
    );

    const params = {
      offset,
      pageSize,
      sort,
      sortOrder: SORT_ORDER[sort.dir],
      filters,
      defaultFilterColumn,
    };

    return this.$q
      .resolve(this.DedicatedCloud.getActiveDirectories(this.productId, params))
      .then((activeDirectories) => {
        return {
          data: activeDirectories.slice(offset - 1, offset - 1 + pageSize),
          meta: {
            totalCount: activeDirectories.length,
          },
        };
      });
  }

  refreshActiveDirectoriesGrid() {
    return this.ouiDatagridService.refresh(
      'pcc-active-directories-datagrid',
      true,
    );
  }

  static criteriaMap(criteria, defaultFilterColumn) {
    return criteria.map((filter) => ({
      field: filter.property || defaultFilterColumn,
      comparator: filter.operator,
      reference: [filter.value],
    }));
  }

  getActiveDirectoryStateEnumFilter() {
    const states = ENUM_ACTIVE_DIRECTORY_STATUS;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      set(
        filter.values,
        state,
        this.$translate.instant(`dedicatedCloud_USER_AD_status_${state}`),
      );
    });

    return filter;
  }
}
