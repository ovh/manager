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
    this.filteredVrackServices = [];
    this.vrackServicesLoader = false;
    this.disableVrackServicesField = false;
    this.disableSubnetField = true;

    this.stepper = {
      vrackSelection: { name: 'vrack_selection', display: null },
      vrackServicesSelection: {
        name: 'vrack_services_selection',
        display: null,
      },
    };

    this.currentStep = 0;

    if (!this.vracks?.length) {
      const noVrack = {
        internalName: this.$translate.instant(
          'netapp_network_configuration_no_vrack_field',
        ),
      };
      this.vracks.push(noVrack);
      this.selectedVrack = noVrack;
      this.disableVrackField = true;
    }
  }

  onVrackSelected() {
    this.disableVrackServicesField = false;
    this.selectedVrackService = null;
    this.vrackServicesLoader = true;
    this.NetappNetworkConfigurationService.getAllowedVrackServices(
      this.selectedVrack.internalName,
    )
      .then((services) => {
        this.filteredVrackServices = this.vrackServices.filter((vrs) =>
          services.vrackServices.includes(vrs.id),
        );
      })
      .catch(() => {
        this.filteredVrackServices = [];
      })
      .finally(() => {
        this.vrackServicesLoader = false;
        if (!this.filteredVrackServices?.length) {
          const noVrackServices = {
            display: {
              nameWithVrackId: this.$translate.instant(
                'netapp_network_configuration_no_vrack_services_field',
                { vrack: this.selectedVrack?.internalName },
              ),
            },
          };
          this.filteredVrackServices.push(noVrackServices);
          this.selectedVrackService = noVrackServices;
          this.disableVrackServicesField = true;
        }
      });
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
      this.selectedVrack.internalName,
      this.selectedVrackService,
      this.selectedSubnet,
      this.storage,
    )
      .then((data) => {
        this.trackSuccess();
        this.goBack().then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'netapp_network_configuration_success_message',
            ),
          );

          if (!data.vrackAssociationStatus?.success) {
            this.Alerter.set(
              'alert-warning',
              this.$translate.instant(
                'netapp_network_configuration_vrack_association_warning',
                {
                  message: data.vrackAssociationStatus.message,
                  requestId: data.vrackAssociationStatus.requestId,
                },
              ),
              null,
              'netapp.alerts.warning',
            );
          }
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
