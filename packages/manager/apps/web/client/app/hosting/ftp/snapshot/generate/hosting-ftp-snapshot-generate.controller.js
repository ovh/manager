import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import pull from 'lodash/pull';

angular.module('App').controller(
  'HostingFtpGenerateSnapshotCtrl',
  class HostingFtpGenerateSnapshotCtrl {
    /* @ngInject */
    constructor(
      $rootScope,
      $scope,
      $stateParams,
      $translate,
      Alerter,
      Hosting,
      HostingFtp,
    ) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;

      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingFtp = HostingFtp;
    }

    $onInit() {
      this.model = {};
      this.loading = true;

      this.$scope.generateSnapshot = () => this.generateSnapshot();

      this.HostingFtp.getModels()
        .then(({ models }) => {
          this.instances = models['hosting.web.backup.TypeEnum'].enum;
          [this.model.snapshotInstance] = this.instances;

          pull(this.instances, 'weekly.2');

          this.Hosting.getSelected(this.$stateParams.productId).then(
            (hosting) => {
              // remove backup snapshots that are not yet available
              if (
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
              'hosting_tab_FTP_configuration_generate_snapshot_error',
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

    generateSnapshot() {
      this.loading = true;

      // Still use the same API call as restore one
      return this.HostingFtp.restoreSnapshot(this.$stateParams.productId, {
        backup: this.model.snapshotInstance,
      })
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_generate_snapshot_success',
            ),
            this.$scope.alerts.main,
          );
          this.$rootScope.$broadcast('hosting.tabs.tasks.refresh');
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_FTP_configuration_generate_snapshot_error',
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
