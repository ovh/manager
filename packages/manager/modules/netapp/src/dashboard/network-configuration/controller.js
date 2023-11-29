import { LABELS, TRACKING_BASE } from './constants';

export default class OvhManagerNetAppNetworkConfigurationCtrl {
  /* @ngInject */
  constructor($translate, Alerter, NetappNetworkConfigurationService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.NetappNetworkConfigurationService = NetappNetworkConfigurationService;
    this.LABELS = LABELS;
    this.TRACKING_BASE = TRACKING_BASE;
  }

  $onInit() {
    this.disableVrackServicesField = false;
    this.disableSubnetField = true;

    if (!this.vrackServices?.length) {
      const noVrackServices = {
        display: {
          nameWithVrackId: this.$translate.instant(
            'netapp_network_configuration_no_vrack_service_field',
          ),
        },
      };
      this.vrackServices.push(noVrackServices);
      this.selectedVrackService = noVrackServices;
      this.disableVrackServicesField = true;
    }
  }

  onVrackServiceSelected(vrackService) {
    this.selectedSubnet = null;
    this.subnets = angular.copy(vrackService.currentState.subnets);

    if (!this.subnets?.length) {
      const noSubnet = {
        displayName: this.$translate.instant(
          'netapp_network_configuration_no_subnet_field',
        ),
      };
      this.subnets.push(noSubnet);
      this.selectedSubnet = noSubnet;
      this.disableSubnetField = true;
    } else {
      this.disableSubnetField = false;
    }
  }

  configureNetwork() {
    this.trackClick('confirm');

    this.NetappNetworkConfigurationService.linkVrackServiceToEfs(
      this.selectedVrackService,
      this.selectedSubnet,
      this.storage,
    )
      .then(() => {
        this.trackSuccess();
        this.goBack().then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'netapp_network_configuration_success_message',
            ),
          );
        });
      })
      .catch((error) => {
        this.trackError();
        this.Alerter.error(
          this.$translate.instant('netapp_dashboard_global_error', {
            message: error?.data?.message || error.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'netapp.alerts.network',
        );
      });
  }
}
