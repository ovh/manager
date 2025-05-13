import get from 'lodash/get';
import set from 'lodash/set';

angular.module('App').controller(
  'HostingCronDeleteCtrl',
  class HostingCronDeleteCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, HostingCron, Alerter) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.HostingCron = HostingCron;
      this.Alerter = Alerter;
    }

    $onInit() {
      this.entryToDelete = this.$scope.currentActionData;
      this.$scope.deleteCron = () => this.deleteCron();
    }

    deleteCron() {
      this.HostingCron.deleteCron(
        this.$stateParams.productId,
        this.entryToDelete.id,
      )
        .then(() => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_CRON_configuration_delete_success',
            ),
            { idTask: 42, state: 'OK' },
            this.$scope.alerts.main,
          );
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_tab_CRON_configuration_delete_fail',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  },
);
