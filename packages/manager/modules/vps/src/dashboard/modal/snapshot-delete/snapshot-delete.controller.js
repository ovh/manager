export default class VpsDeleteSnapshotCtrl {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucControllerHelper,
    CucCloudMessage,
    VpsService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `vps::detail::dashboard::snapshot-delete::${hit}`,
      type: 'navigation',
    });
  }

  cancel() {
    this.trackClick('cancel');
    return this.goBack();
  }

  confirm() {
    this.trackClick('confirm');
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.deleteSnapshot(this.serviceName)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_delete_snapshot_success',
                { serviceName: this.serviceName },
              ),
            ),
          )
          .catch((error) =>
            this.CucCloudMessage.error(
              error.message ||
                this.$translate.instant(
                  'vps_configuration_delete_snapshot_fail',
                ),
            ),
          )
          .finally(() => this.goBack()),
    });
    return this.delete.load();
  }
}
