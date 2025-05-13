import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import pull from 'lodash/pull';

angular.module('App').controller(
  'HostingFtpRestoreSnapshotCtrl',
  class HostingFtpRestoreSnapshotCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $rootScope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingFtp,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingFtp = HostingFtp;
    }

    $onInit() {
      this.model = {};
      this.loading = true;

      this.$scope.restoreSnapshot = () => this.restoreSnapshot();

      this.HostingFtp.getModels()
        .then((data) => {
          this.instances = data.models['hosting.web.backup.TypeEnum'].enum;
          [this.model.snapshotInstance] = this.instances;

          this.Hosting.getSelected(this.$stateParams.productId).then(
            (hosting) => {
              // remove backup snapshots that are not yet available
              if (
                moment(hosting.creation).isAfter(moment().subtract(2, 'weeks'))
              ) {
                pull(this.instances, 'weekly.2');
              } else if (
                moment(hosting.creation).isAfter(moment().subtract(1, 'weeks'))
              ) {
                pull(this.instances, 'weekly.1');
              } else if (
                moment(hosting.creation).isAfter(moment().subtract(3, 'days'))
              ) {
                pull(this.instances, 'daily.3');
              } else if (
                moment(hosting.creation).isAfter(moment().subtract(2, 'days'))
              ) {
                pull(this.instances, 'daily.2');
              }
            },
          );
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_restore_snapshot_error',
            ),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    isStep1Valid() {
      return (
        this.instances &&
        this.model.snapshotInstance &&
        indexOf(this.instances, this.model.snapshotInstance) !== -1
      );
    }

    restoreSnapshot() {
      this.loading = true;
      return this.HostingFtp.restoreSnapshot(this.$stateParams.productId, {
        backup: this.model.snapshotInstance,
      })
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_restore_snapshot_success',
            ),
            this.$scope.alerts.main,
          );
          this.$rootScope.$broadcast('hosting.tabs.tasks.refresh');
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_restore_snapshot_error',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
