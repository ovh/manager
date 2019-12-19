export default class VpsSnapshotOrderLegacyCtrl {
  /* @ngInject */
  constructor($stateParams, $translate, $window, CucCloudMessage, CucCloudNavigation, VpsService) {
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.VpsService = VpsService;

    this.loaders = {
      init: false,
      options: false,
    };

    this.model = {
      vps: null,
      optionDetails: null,
      url: null,
      contractsValidated: false,
    };
  }

  $onInit() {
    this.previousState = this.CucCloudNavigation.getPreviousState();
  }

  loadVps() {
    this.loaders.init = true;
    this.VpsService.getSelectedVps(this.serviceName)
      .then((data) => {
        this.model.vps = data;
        this.loadOptionDetails();
      })
      .catch((error) => this.CucCloudMessage.error(error.message || this.$translate.instant('vps_configuration_activate_snapshot_fail')))
      .finally(() => { this.loaders.init = false; });
  }

  loadOptionDetails() {
    this.loaders.options = true;
    this.VpsService.getOptionSnapshotFormated(this.serviceName)
      .then((data) => { this.model.optionDetails = data; })
      .catch((error) => this.CucCloudMessage.error(error.message || this.$translate.instant('vps_configuration_activate_snapshot_fail')))
      .finally(() => { this.loaders.options = false; });
  }

  orderOption() {
    if (this.model.optionDetails && this.model.contractsValidated) {
      this.VpsService.orderOption(this.serviceName, 'snapshot', this.model.optionDetails.duration.duration)
        .then(({ url }) => {
          this.model.url = url;
        })
        .catch(() => this.CucCloudMessage.error(this.$translate.instant('vps_configuration_activate_snapshot_fail')));
    } else if (this.model.contractsValidated) {
      this.CucCloudMessage.error(this.$translate.instant('vps_configuration_activate_snapshot_fail'));
    }
  }

  cancel() {
    this.previousState.go();
  }

  confirm() {
    this.displayBC();
  }

  displayBC() {
    this.$window.open(
      this.model.url,
      '_blank',
    );
  }
}
