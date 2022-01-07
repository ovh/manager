import { CHANGE_OWNER_URL } from './general-information.constants';
import { TENANT_STATUS } from '../../anthos.constants';

export default class {
  /* @ngInject */
  constructor($filter, $translate, Alerter, AnthosTenantsService) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.AnthosTenantsService = AnthosTenantsService;
    this.isSoftwareUpdatable = false;
    this.isSoftwareUpdating = false;
  }

  $onInit() {
    this.changeOwnerUrl =
      CHANGE_OWNER_URL[this.user.ovhSubsidiary] || CHANGE_OWNER_URL.FR;
    const {
      availableVersions,
      tenant: { status },
    } = this;
    this.isSoftwareUpdatable = availableVersions.length > 0;
    this.isSoftwareUpdating = status === TENANT_STATUS.UPGRADING;
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

  onGoToSoftwareUpdate() {
    this.trackClick(`${this.generalInfoHitTracking}::check-updates`);

    return this.goToSoftwareUpdate();
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
}
