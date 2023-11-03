export default class DedicatedCloudIamCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    DedicatedCloud,
    ouiDatagridService,
    ovhFeatureFlipping,
    coreURLBuilder,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.ouiDatagridService = ouiDatagridService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.loading = true;
    return this.$q
      .all({
        featureAvailability: this.ovhFeatureFlipping
          .checkFeatureAvailability('iam')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable('iam'),
          ),
        iamStatus: this.DedicatedCloud.getIamStatus(this.productId),
      })
      .then(({ iamStatus, featureAvailability }) => {
        this.iamFeatureAvailability = featureAvailability;
        this.iamEnabled = iamStatus?.state === 'enabled';
        this.iamDisabled = iamStatus?.state === 'disabled';
        this.iamStatus = iamStatus;

        if (this.iamEnabled || this.iamDisabled) {
          return this.DedicatedCloud.isIamTogglable(
            this.productId,
            this.iamStatus.state,
          )
            .then((isIamTogglable) => {
              this.iamTogglable = isIamTogglable;
            })
            .catch((error) => {
              this.iamTogglable = false;
              this.iamTogglableError = error.data?.message;
            });
        }
        return null;
      })
      .catch((err) => {
        return this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_USER_iam_load_error',
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getIamDashboardUrl() {
    return this.coreURLBuilder.buildURL('iam', '/');
  }

  onGoToToggleIamClick(iamToggleState) {
    this.trackClick('toggle-iam');
    return this.goToToggleIam(iamToggleState);
  }
}
