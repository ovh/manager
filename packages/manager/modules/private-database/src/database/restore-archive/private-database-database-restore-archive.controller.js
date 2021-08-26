import angular from 'angular';
import includes from 'lodash/includes';

export default class PrivateDatabaseRestoreArchiveBDDCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $window,
    Alerter,
    $stateParams,
    PrivateDatabase,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$window = $window;
    this.alerter = Alerter;
    this.$stateParams = $stateParams;
    this.privateDatabase = PrivateDatabase;

    this.$scope.bddName = angular.copy(this.$scope.currentActionData.bdd);
    this.$scope.dump = angular.copy(this.$scope.currentActionData.dump);
    this.parentScope = this.$scope.currentActionData.func;

    this.$scope.step = 0;
  }

  canRestore() {
    return this.privateDatabase
      .getBDDSId(this.productId)
      .then((bddsId) => {
        if (includes(bddsId, this.$scope.bddName)) {
          this.$scope.step = 2;
        } else {
          this.$scope.step = 1;
        }
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_restore_bdd_error'),
          err,
          this.$scope.alerts.main,
        );
        this.$scope.resetAction();
      });
  }

  restoreBDDNoBDD() {
    return this.privateDatabase
      .restoreBDDNoBDD(
        this.productId,
        this.$scope.bddName,
        this.$scope.dump.dumpId,
      )
      .then(() =>
        this.alerter.success(
          this.$translate.instant(
            'privateDatabase_tabs_dumps_restore_in_progress',
          ),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_restore_bdd_fail'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.canRestore();

    this.$scope.confirmBtnAction = () => {
      switch (this.$scope.step) {
        case 1:
          this.parentScope.goToList();
          this.$scope.resetAction();
          break;

        case 2:
          this.restoreBDDNoBDD();
          break;

        default:
          this.$scope.resetAction();
      }
    };

    this.$scope.confirmBtnTitle = () => {
      switch (this.$scope.step) {
        case 1:
          return this.$translate.instant('privateDatabase_restore_bdd_go_list');

        case 2:
          return this.$translate.instant('privateDatabase_restore_bdd_restore');

        default:
          return this.$translate.instant('privateDatabase_restore_bdd_close');
      }
    };
  }
}
