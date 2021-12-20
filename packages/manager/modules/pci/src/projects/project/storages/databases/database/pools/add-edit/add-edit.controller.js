import { POOL_MODES, POOL_VALIDATION } from './add-edit.constants';

export default class {
  /* @ngInject */
  constructor(atInternet, DatabaseService, $translate) {
    this.poolData = {};
    this.modes = POOL_MODES;
    this.POOL_VALIDATION = POOL_VALIDATION;
    this.atInternet = atInternet;
    this.DatabaseService = DatabaseService;
    this.$translate = $translate;
    this.isLoading = false;
  }

  $onInit() {
    this.updatePool = !!this.pool;
    Object.assign(this.poolData, this.pool);
  }

  /**
   *
   * @returns payload
   */
  preparePayload() {
    const { size, database, user, mode, name } = this.poolData;
    return {
      mode,
      name,
      userId: user?.id,
      databaseId: database.id,
      size,
    };
  }

  createPool(payload) {
    this.trackDashboard('pools::add_pool_confirm', 'action');
    this.atInternet.trackClick({
      name: `PublicCloud_databases_add_pools::${payload.mode}::${payload.size}`,
      type: 'action',
    });
    return this.DatabaseService.createConnectionPool(
      this.projectId,
      this.databaseId,
      payload,
    );
  }

  modifyPool(payload) {
    const { name, ...data } = payload; // Remove name from the payload
    this.trackDashboard('pools::entry_menu::modify_confirm', 'action');
    return this.DatabaseService.updateConnectionPool(
      this.projectId,
      this.databaseId,
      this.pool.id,
      data,
    );
  }

  addOrEditPool() {
    this.isLoading = true;
    const payload = this.preparePayload();
    let promise = null;
    if (!this.updatePool) {
      promise = this.createPool(payload);
    } else {
      promise = this.modifyPool(payload);
    }

    return promise
      .then((data) => {
        return this.goBack(
          this.$translate.instant(
            this.updatePool
              ? 'pci_databases_pools_modify_pool_success'
              : 'pci_databases_pools_add_pool_success',
            { name: data.name },
          ),
          'success',
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            this.updatePool
              ? 'pci_databases_pools_modify_pool_error'
              : 'pci_databases_pools_add_pool_error',
            {
              message: error.data?.message || null,
              name: this.pool?.name,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancelAddOrEditPool() {
    this.trackDashboard(
      this.isUpdate
        ? 'pools::entry_menu::modify_cancel'
        : 'pools::add_pool_cancel',
      'action',
    );
    this.goBack();
  }
}
