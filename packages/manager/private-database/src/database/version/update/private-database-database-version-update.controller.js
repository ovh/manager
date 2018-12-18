import _ from 'lodash';

export default class PrivateDatabaseChangeVersionCtrl {
  /* @ngInject */

  constructor($scope, $stateParams, $translate, Alerter, PrivateDatabase) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
  }

  $onInit() {
    this.productId = this.$stateParams.serviceName;

    this.privateDBToUpdate = this.$scope.currentActionData;

    this.loading = {
      init: true,
    };
    this.model = {
      versions: [],
      choice: null,
    };

    this.$scope.updateVersion = () => this.updateVersion();

    this.getAvailableVersions();
  }

  getAvailableVersions() {
    this.loading.init = true;

    this.privateDatabaseService
      .getAvailableVersions(this.productId)
      .then((versions) => {
        this.model.versions = versions;

        _.remove(
          this.model.versions,
          version => version.replace(/\./g, '')
            === this.$scope.currentActionData.version,
        );

        this.loading.init = false;
      })
      .catch((err) => {
        this.$scope.resetAction();
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_change_version_step1_fail', {
            t0: this.$scope.entryToDelete,
          }),
          _.get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }

  updateVersion() {
    this.$scope.resetAction();

    this.privateDatabaseService
      .changeVersion(this.productId, this.model.choice)
      .then((task) => {
        this.$scope.pollAction(task);
        this.alerter.success(
          this.$translate.instant('privateDatabase_change_version_success'),
          this.$scope.alerts.main,
        );
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_change_version_fail'),
          _.get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }
}
