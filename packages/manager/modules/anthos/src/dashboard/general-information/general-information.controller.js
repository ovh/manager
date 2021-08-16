export default class {
  /* @ngInject */
  constructor($filter, $translate, Alerter, AnthosTenantsService) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  computeStoragePercent(value) {
    return (value / this.netappStorage.totalSize) * 100;
  }

  getStorageInfo() {
    const { totalSize, usedSize } = this.netappStorage;
    const usedStorage = this.$filter('cucBytes')(usedSize, 0, false, 'MB');
    const totalStorage = this.$filter('cucBytes')(totalSize, 0, false, 'MB');
    const percentStorage = this.computeStoragePercent(usedSize).toFixed(2);
    return `${usedStorage} / ${totalStorage} (${percentStorage}%)`;
  }

  onAnthosRegeneratePasswordClick() {
    return this.AnthosTenantsService.resetTenantAdminAccess(this.serviceName)
      .then(({ accessUrl }) => {
        this.tenant.accessUrl = accessUrl;
        return this.displayAlerterMessage(
          'success',
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_security_center_access_anthos_menu_regenerate_pwd_success',
          ),
        );
      })
      .catch((error) => {
        return this.displayAlerterMessage(
          'error',
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_security_center_access_anthos_menu_regenerate_pwd_failed',
            {
              message: error.message || error.data?.message,
            },
          ),
        );
      });
  }

  onNetappRegeneratePasswordClick() {
    return this.AnthosTenantsService.resetTenantStorageAdminAccess(
      this.serviceName,
    )
      .then(({ accessUrl }) => {
        this.tenant.storageAccessUrl = accessUrl;
        return this.displayAlerterMessage(
          'success',
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_security_center_access_netapp_menu_regenerate_pwd_success',
          ),
        );
      })
      .catch((error) => {
        return this.displayAlerterMessage(
          'error',
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_security_center_access_netapp_menu_regenerate_pwd_failed',
            {
              message: error.message || error.data?.message,
            },
          ),
        );
      });
  }
}
