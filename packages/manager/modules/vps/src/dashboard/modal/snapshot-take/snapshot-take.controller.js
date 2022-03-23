export default class VpsTakeSnapshotCtrl {
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

    this.snapshot = {
      description: '',
    };
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `vps::detail::dashboard::snapshot-take::${hit}`,
      type: 'navigation',
    });
  }

  cancel() {
    this.trackClick('cancel');
    return this.goBack();
  }

  confirm() {
    this.trackClick('confirm');
    this.save = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.takeSnapshot(this.serviceName, this.snapshot)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_snapshot_take_success',
                { serviceName: this.serviceName },
              ),
            ),
          )
          .catch((err) =>
            this.CucCloudMessage.error(
              err.message ||
                this.$translate.instant('vps_configuration_snapshot_take_fail'),
            ),
          )
          .finally(() => this.goBack()),
    });
    return this.save.load();
  }
}
