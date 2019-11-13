export default class VpsOrderVeeamLegacyCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, $window,
    atInternet, CucCloudMessage, CucCloudNavigation, VpsService, CucServiceHelper) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.serviceName = $stateParams.serviceName;
    this.VpsService = VpsService;
    this.CucServiceHelper = CucServiceHelper;


    $scope.model = {
      vps: undefined,
      optionDetails: undefined,
      url: undefined,
      contractsValidated: undefined,
    };

    VpsService.getSelectedVps(this.serviceName)
      .then((data) => {
        $scope.model.vps = data;
        VpsService.getVeeamOption(this.serviceName)
          .then((veeamOption) => {
            $scope.model.optionDetails = veeamOption;
            VpsService.getPriceOptions($scope.model.vps).then((price) => {
              $scope.model.optionDetails.unitaryPrice = price.data.text;
            });
          });
      })
      .catch((error) => {
        this.CucCloudMessage.error(`${this.$translate.instant('vps_configuration_veeam_order_step1_loading_error')} ${error.data}`);
      });
  }

  $onInit() {
    this.previousState = this.CucCloudNavigation.getPreviousState();
    this.VpsService.canOrderOption(this.serviceName, 'automatedBackup').catch(() => {
      this.CucCloudMessage.error(this.$translate.instant('vps_tab_VEEAM_dashboard_veeam_unavailable'));
    });
  }

  orderOption() {
    if (this.$scope.model.optionDetails && this.$scope.model.contractsValidated) {
      this.CucServiceHelper
        .loadOnNewPage(this.VpsService
          .orderVeeamOption(this.serviceName, this.$scope.model.optionDetails.duration.duration))
        .then(({ url }) => {
          this.$scope.model.url = url;
        });
      this.atInternet.trackClick({
        name: 'VPS-backup-order',
        type: 'action',
      });
    } else if (this.$scope.model.contractsValidated) {
      this.CucCloudMessage.error(this.$translate.instant('vps_configuration_veeam_order_fail'));
    }
  }

  cancel() {
    this.previousState.go();
  }
}
