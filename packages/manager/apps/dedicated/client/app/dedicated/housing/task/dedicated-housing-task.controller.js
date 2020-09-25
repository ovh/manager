export default class DedicatedHousingTaskController {
  /* @ngInject */
  constructor($scope, $stateParams, Alerter, Housing, TASK_STATUS) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.Alerter = Alerter;
    this.Housing = Housing;
    this.TASK_STATUS = TASK_STATUS;
  }

  loadDatagridTasks({ offset, pageSize }) {
    return this.Housing.getTaskIds(this.$stateParams.productId)
      .then((ids) => {
        const part = ids.slice(offset - 1, offset - 1 + pageSize);
        return {
          data: part.map((id) => ({ id })),
          meta: {
            totalCount: ids.length,
          },
        };
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('housing_configuration_task_loading_error'),
          err,
          'housing_tab_tasks_alert',
        ),
      );
  }

  transformItem({ id }) {
    return this.Housing.getTask(this.$stateParams.productId, id);
  }
}
