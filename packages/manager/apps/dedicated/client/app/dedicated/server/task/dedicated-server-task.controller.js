import get from 'lodash/get';

angular.module('App').controller(
  'TaskCtrl',
  class DedicatedServerTaskController {
    constructor($scope, $stateParams, Alerter, Server, TASK_STATUS) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.Alerter = Alerter;
      this.Server = Server;
      this.TASK_STATUS = TASK_STATUS;
    }

    loadDatagridTasks({ offset, pageSize }) {
      return this.Server.getTasks(
        this.$stateParams.productId,
        pageSize,
        offset - 1,
      )
        .then((result) => ({
          data: get(result, 'list.results'),
          meta: {
            totalCount: result.count,
          },
        }))
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('server_configuration_task_loading_error'),
            err,
            'taskAlert',
          );
        });
    }
  },
);
