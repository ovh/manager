import { POOL_MODES, POOL_VALIDATION } from './add.constants';

export default class PoolsAddController {
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

  addPool() {
    this.isLoading = true;
    const payload = this.preparePayload();
    this.trackDashboard('pools::add_pool_confirm', 'action');
    this.atInternet.trackClick({
      name: `PublicCloud_databases_add_pools::${payload.mode}::${payload.size}`,
      type: 'action',
    });

    return this.DatabaseService.createConnectionPool(
      this.projectId,
      this.database.engine,
      this.databaseId,
      payload,
    )
      .then((data) => {
        return this.goBack(
          this.$translate.instant('pci_databases_pools_add_pool_success', {
            name: data.name,
          }),
          'success',
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant('pci_databases_pools_add_pool_error', {
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

  cancelAddPool() {
    this.trackDashboard('pools::add_pool_cancel', 'action');
    this.goBack();
  }
}
