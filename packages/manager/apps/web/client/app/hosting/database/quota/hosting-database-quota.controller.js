import get from 'lodash/get';
import set from 'lodash/set';

angular.module('App').controller(
  'HostingDatabaseCheckQuotaCtrl',
  class HostingDatabaseCheckQuotaCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, Alerter, HostingDatabase) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.hostingDatabaseService = HostingDatabase;
    }

    $onInit() {
      this.bddName = this.$scope.currentActionData.database;
      this.$scope.checkQuota = () => this.checkQuota();
    }

    checkQuota() {
      const completionDeferred = this.$scope.currentActionData.deferred;

      this.$scope.resetAction();
      return this.hostingDatabaseService
        .requestDatabaseQuotaCheck(this.$stateParams.productId, this.bddName)
        .then((data) => {
          this.alerter.success(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_check_quota_success',
              { t0: this.bddName },
            ),
            this.$scope.alerts.main,
          );
          completionDeferred.resolve(data);
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_DATABASES_configuration_check_quota_fail',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
          completionDeferred.reject(err);
        });
    }
  },
);
