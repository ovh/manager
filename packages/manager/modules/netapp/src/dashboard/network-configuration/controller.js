import { LABELS } from '../constants';
import { TRACKING_BASE } from './constants';

export default class OvhManagerNetAppNetworkConfigurationCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    Alerter,
    coreConfig,
    NetAppDashboardService,
    NetappNetworkConfigurationService,
  ) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.NetAppDashboardService = NetAppDashboardService;
    this.NetappNetworkConfigurationService = NetappNetworkConfigurationService;
    this.LABELS = LABELS;
    this.TRACKING_BASE = TRACKING_BASE;
    this.$window = $window;
    this.user = coreConfig.getUser();
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

    if (!this.vracks.length) {
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

  goToVrackOrder(event) {
    event.preventDefault();
    this.trackClick('add-vrack');
    this.$window.open(
      this.NetAppDashboardService.constructor.getVrackOrderUrl(
        this.user.ovhSubsidiary,
      ),
      '_blank',
    );
  }

  onVrackSelected() {
    this.disableVrackServicesField = false;
    this.selectedVrackService = null;

    // Get vrack services associated to this vrack
    this.filteredVrackServices = this.vrackServices.filter(
      (vrs) => vrs.currentState.vrackId === this.selectedVrack.internalName,
    );

    // Get vrack allowed services and concat to the vrack services list
    this.NetAppDashboardService.getAllowedVrackServices(
      this.selectedVrack.internalName,
    ).then(({ vrackServices }) => {
      this.filteredVrackServices = this.filteredVrackServices.concat(
        vrackServices.map((vrackServicesId) =>
          this.vrackServices.find((vrs) => vrs.id === vrackServicesId),
        ),
      );

      // If there is no vrack services allowed for this vrack, we create a default one for display
      if (!this.filteredVrackServices.length) {
        const noVrackServices = {
          display: {
            nameWithVrackId: this.$translate.instant(
              'netapp_network_configuration_no_vrack_services_field',
              { vrack: this.selectedVrack.internalName },
            ),
          },
        };
        this.filteredVrackServices.push(noVrackServices);
        this.selectedVrackService = noVrackServices;
        this.disableVrackServicesField = true;
      }
    });
  }

  focusVrackStep() {
    this.selectedVrackService = null;
    this.selectedSubnet = null;
  }

  onVrackServiceSelected(vrackService) {
    this.selectedSubnet = null;
    this.subnets = (vrackService.currentState.subnets || []).map((subnet) => ({
      ...subnet,
      displayName: subnet.displayName ?? subnet.cidr,
    }));

    if (!this.subnets.length) {
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
        this.trackPage('success');
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
        this.trackPage('error');
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
