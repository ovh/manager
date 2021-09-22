import { CHANGE_OWNER_URL } from './general-information.constants';

export default class {
  /* @ngInject */
  constructor($filter, $translate, Alerter, AnthosTenantsService) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  $onInit() {
    this.changeOwnerUrl =
      CHANGE_OWNER_URL[this.user.ovhSubsidiary] || CHANGE_OWNER_URL.FR;
  }

  onGoToOrderHost() {
    this.trackClick(`${this.generalInfoHitTracking}::add-new-host`);

    return this.goToOrderHost();
  }

  onGoToOrderStorage() {
    this.trackClick(`${this.generalInfoHitTracking}::add-volume`);

    return this.goToOrderStorage();
  }

  onGoToOrderPublicIp() {
    this.trackClick(`${this.generalInfoHitTracking}::order-public-ip`);

    return this.goToOrderPublicIp();
  }

  onGoToAssignPrivateIp() {
    this.trackClick(`${this.generalInfoHitTracking}::assign-private-ip`);

    return this.goToAssignPrivateIp();
  }

  onAnthosConsoleStart() {
    return this.trackClick(
      `${this.generalInfoHitTracking}::launch-anthos-console`,
    );
  }

  onChangeOwnerClick() {
    return this.trackClick(`${this.generalInfoHitTracking}::change-owner`);
  }

  onAnthosRegeneratePasswordClick() {
    this.trackClick(`${this.generalInfoHitTracking}::regen-anthos-password`);

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
