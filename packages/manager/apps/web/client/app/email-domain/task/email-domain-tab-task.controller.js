import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';

angular.module('App').controller(
  'EmailsTabTasksCtrl',
  class EmailsTabTasksCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $stateParams
     * @param $translate
     * @param Alerter
     * @param WucEmails
     */
    constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.WucEmails = WucEmails;
    }

    $onInit() {
      this.refreshTasks();
    }

    refreshTasks() {
      this.taskIds = [];
      return this.WucEmails.getAllTaskIds(this.$stateParams.productId)
        .then((ids) => {
          forEach(ids, (type) => {
            forEach(type.ids, (id) => {
              this.taskIds.push({ action: type.action, id });
            });
          });
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('email_tab_TASK_error_message'),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });
    }

    transformItem(item) {
      return this.WucEmails.getTask(this.$stateParams.productId, item);
    }
  },
);
