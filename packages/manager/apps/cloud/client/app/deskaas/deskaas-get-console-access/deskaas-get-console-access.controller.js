import get from 'lodash/get';

export default class DeskaasGetConsoleAccessCtrl {
  /* @ngInject */
  constructor($translate, OvhApiDeskaasService) {
    this.$translate = $translate;
    this.OvhApiDeskaasService = OvhApiDeskaasService;
  }

  ok() {
    // Call POST /console to create the task, an email will be sent to the user
    return this.getConsole();
  }

  cancel() {
    // Remove popup
    this.goBackToDetails();
  }

  getConsole() {
    const promise = this.OvhApiDeskaasService.v6()
      .console({ serviceName: this.serviceName }, null).$promise;

    return promise.then(result => this.goBackToDetails(
      this.$translate.instant('vdi_console_task', {
        serviceName: this.serviceName,
      }),
      'success',
      {
        task: result.taskId,
      },
    ))
      .catch((error) => {
        this.goBackToDetails(
          this.$translate.instant('vdi_task_error', {
            id: this.serviceName,
            message: get(error, 'data.message'),
          }),
          'error',
        );
      });
  }
}
