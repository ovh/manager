import set from 'lodash/set';

export default class SharepointTasksCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.getTasks();
  }

  getTasks() {
    this.tasksIds = null;

    return this.sharepointService
      .getTasks(this.$stateParams.exchangeId)
      .then((ids) => {
        this.tasksIds = ids.map((id) => ({ id }));
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_tabs_tasks_error'),
          err,
          this.$scope.alerts.main,
        );
      });
  }

  onTransformItem(taskId) {
    return this.sharepointService.getTask(this.$stateParams.exchangeId, taskId);
  }
}
