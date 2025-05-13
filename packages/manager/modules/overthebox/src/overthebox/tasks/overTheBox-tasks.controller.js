export default class OverTheBoxTasksCtrl {
  /* @ngInject */
  constructor($translate, PAGINATION_PER_PAGE, OvhApiOverTheBox, TucToast) {
    this.$translate = $translate;
    this.PAGINATION_PER_PAGE = PAGINATION_PER_PAGE;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loaders = {
      init: true,
    };

    this.taskIds = [];
    this.tasks = [];
    this.filter = {
      perPage: this.PAGINATION_PER_PAGE,
    };

    this.getTasks();
  }

  getTasks() {
    this.OvhApiOverTheBox.v6()
      .getTasks({ serviceName: this.serviceName })
      .$promise.then((taskIds) => {
        this.taskIds = taskIds.map((taskId) => ({ id: taskId }));
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant('an_error_occured')} ${
            error.data.message
          }`,
        );
      });
  }

  transformItem(row) {
    return this.OvhApiOverTheBox.v6()
      .getTask({ serviceName: this.serviceName, taskId: row.id })
      .$promise.then((task) => task)
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant('an_error_occured')} ${
            error.data.message
          }`,
        );
      });
  }
}
