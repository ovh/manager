export default class {
  /* @ngInject */
  constructor($q, $timeout, $translate, Alerter, olaService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.olaService = olaService;
  }

  $onInit() {
    this.olaService
      .waitTasks(this.serverName)
      .then(() => {
        this.goToInterfaces();
      })
      .catch(({ comment }) =>
        this.Alerter.error(
          this.$translate.instant('dedicated_server_interfaces_task_error', {
            errorMessage: comment,
          }),
        ),
      );
  }
}
