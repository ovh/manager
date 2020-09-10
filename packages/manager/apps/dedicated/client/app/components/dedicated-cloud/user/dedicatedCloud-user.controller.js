import set from 'lodash/set';

export default class {
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
        policy: this.DedicatedCloud.getPasswordPolicy(this.productId),
        nsxOptions: this.DedicatedCloud.getOptionState('nsx', this.productId),
      })
      .then((response) => {
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
        return user;
      },
    );
  }

  refreshGrid() {
    return this.ouiDatagridService.refresh('pcc-user-datagrid', true);
  }
}
