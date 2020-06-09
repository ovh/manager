import snakeCase from 'lodash/snakeCase';
import toUpper from 'lodash/toUpper';

export default class {
  constructor($stateParams, Alerter, Server, TASK_STATUS) {
    this.$stateParams = $stateParams;
    this.Alerter = Alerter;
    this.Server = Server;
    this.TASK_STATUS = TASK_STATUS;
  }

  loadDatagridTasks({ offset, pageSize }) {
    return this.Server.getTasks(
      this.$stateParams.productId,
      (offset - 1) / pageSize + 1,
      pageSize,
    )
      .then((result) => ({
        data: result.data.map((task) => ({
          ...task,
          function: toUpper(snakeCase(task.function)),
          status: toUpper(snakeCase(task.status)),
        })),
        meta: {
          totalCount: result.headers('x-pagination-elements'),
        },
      }))
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_configuration_task_loading_error'),
          err.data,
          'taskAlert',
        );
      });
  }
}
