import 'moment';

export default class VpsRestoreSnapshotCtrl {
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
    this.summary = {};
  }

  $onInit() {
    this.snapshotSummary = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getTabSummary(this.serviceName)
          .then((data) => {
            this.summary = data;
            this.date = moment(data.snapshot.creationDate).format('LLL');
          })
          .catch((error) =>
            this.CucCloudMessage.error(
              error.message ||
                this.$translate.instant(
                  'vps_configuration_snapshot_restore_fail',
                ),
            ),
          ),
    });
    return this.snapshotSummary.load();
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: `vps::detail::dashboard::snapshot-restore::${hit}`,
      type: 'navigation',
    });
  }

  cancel() {
    this.trackClick('cancel');
    return this.goBack();
  }

  confirm() {
    this.trackClick('confirm');
    this.restore = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.restoreSnapshot(this.serviceName)
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(
                'vps_configuration_snapshot_restore_success',
                { serviceName: this.serviceName },
              ),
            ),
          )
          .catch((error) =>
            this.CucCloudMessage.error(
              error.message ||
                this.$translate.instant(
                  'vps_configuration_snapshot_restore_fail',
                ),
            ),
          )
          .finally(() => this.goBack()),
    });
    return this.restore.load();
  }
}
