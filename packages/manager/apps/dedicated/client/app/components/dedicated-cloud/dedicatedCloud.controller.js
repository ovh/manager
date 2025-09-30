export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    constants,
    coreURLBuilder,
    ovhFeatureFlipping,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.constants = constants;
    this.coreURLBuilder = coreURLBuilder;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.BETA = 'Beta';
  }

  $onInit() {
    this.isTabsHidden = this.hasVCDMigration;
    if (this.dedicatedCloud.isExpired) {
      this.setMessage(this.$translate.instant('common_expired'), 'danger');
    }

    this.checkLogsAvailability();
  }

  checkLogsAvailability() {
    if (this.isLogsDisabled) {
      this.isLogsAvailable = false;
      return;
    }
    const logsFeature = 'hpc-vmware-vsphere:logs';
    this.ovhFeatureFlipping
      .checkFeatureAvailability(logsFeature)
      .then((featureAvailability) => {
        this.isLogsAvailable = featureAvailability.isFeatureAvailable(
          logsFeature,
        );
      });

    this.logsUrl = this.coreURLBuilder.buildURL(
      'hpc-vmware-vsphere',
      `#/${this.productId}/logs`,
    );
  }

  editDescription(value) {
    return this.editDetails({
      contextTitle: 'dedicatedCloud_description',
      productId: this.productId,
      destinationId: 'dedicatedCloud',
      successText: this.$translate.instant(
        'dedicatedCloud_dashboard_editing_description_success',
      ),
      value,
    }).result;
  }
}
