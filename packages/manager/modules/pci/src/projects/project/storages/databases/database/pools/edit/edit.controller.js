import { POOL_MODES, POOL_VALIDATION } from './edit.constants';

export default class PoolsEditController {
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
    Object.assign(this.poolData, this.pool);
  }

  preparePayload() {
    const { size, database, user, mode } = this.poolData;
    return {
      mode,
      userId: user?.id,
      databaseId: database.id,
      size,
    };
  }

  editPool() {
    this.isLoading = true;
    const payload = this.preparePayload();
    this.trackDashboard('pools::entry_menu::modify_confirm', 'action');
    return this.DatabaseService.updateConnectionPool(
      this.projectId,
      this.database.engine,
      this.databaseId,
      this.pool.id,
      payload,
    )
      .then((data) => {
        return this.goBack(
          this.$translate.instant('pci_databases_pools_modify_pool_success', {
            name: data.name,
          }),
          'success',
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant('pci_databases_pools_modify_pool_error', {
            message: error.data?.message || null,
            name: this.pool?.name,
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancelEditPool() {
    this.trackDashboard('pools::entry_menu::modify_cancel', 'action');
    this.goBack();
  }
}
