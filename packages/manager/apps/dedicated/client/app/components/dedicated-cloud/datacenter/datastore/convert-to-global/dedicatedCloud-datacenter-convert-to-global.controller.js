export default class {
  /* @ngInject */
  constructor(
    $translate,
    ovhManagerPccDatacenterDatastoreService,
    DedicatedCloud,
  ) {
    this.$translate = $translate;
    this.ovhManagerPccDatacenterDatastoreService = ovhManagerPccDatacenterDatastoreService;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loading = false;
    this.trackPage('datacenter::details::datastores::convertToGlobal');
  }

  convertToGlobal() {
    this.trackClick(
      'datacenter::details::datastores::convertToGlobal::confirm',
    );

    this.loading = true;

    const convertToGlobalPromise =
      this.isGlobal === 'true'
        ? this.DedicatedCloud.convertToGlobal(this.productId, this.datastoreId)
        : this.ovhManagerPccDatacenterDatastoreService.convertToGlobal(
            this.productId,
            this.datacenterId,
            this.datastoreId,
          );

    return convertToGlobalPromise
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_datacenter_convert_to_global_success',
            {
              t0: this.datacenterId,
            },
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_convert_to_global_error',
            {
              t0: this.datacenterId,
            },
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onCancel() {
    this.trackClick('datacenter::details::datastores::convertToGlobal::cancel');
    return this.goBack();
  }
}
