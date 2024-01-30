import { PROGRESS_TASK_STATUS } from './server-installation-progress.constants';

export default class ServerInstallationProgressCtrl {
  /* @ngInject */
  constructor($scope, $translate, Server, Polling, $rootScope, $stateParams) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.Server = Server;
    this.$translate = $translate;
    this.Polling = Polling;
  }

  $onInit() {
    this.$scope.serverCtrl = this.$rootScope.serverCtrl;

    this.$scope.progress = {
      server: this.server,
      installationTask: null,
      installationCancel: false,
      endInstallation: false,
      installationValue: 0,
      currentStepNum: 0,
      currentStep: '',
      errorMessage: null,
      nbStep: 0,
      endStep: 0,
      errorStep: 0,
      task: null,
      ws: null,
      wsFail: null,
      disableCancel: false,
      failStatut: false,
    };

    this.$scope.$on('$destroy', () => {
      this.Polling.addKilledScope(this.$scope.$id);
    });
  }

  load() {
    return this.Server.getTaskInProgress(
      this.$stateParams.productId,
      'reinstallServer',
    ).then(
      (taskTab) => {
        if (taskTab.length > 0) {
          [this.$scope.progress.task] = taskTab || [];
          this.$rootScope.$broadcast(
            'dedicated.informations.reinstall',
            taskTab[0],
          );
        }
        return this.checkInstallationProgress();
      },
      () => {
        return this.goBack();
      },
    );
  }

  // task of installation
  startPollReinstall() {
    if (this.$scope.progress.task) {
      // Doing installation
      this.Server.addTaskFast(
        this.$stateParams.productId,
        this.$scope.progress.task,
        this.$scope.$id,
      ).then(
        (state) => {
          if (this.Polling.isResolve(state)) {
            this.$scope.progress.task = null;
          }
          // eslint-disable-next-line no-use-before-define
          this.checkInstallationProgress();
        },
        () => {
          this.reduce();
        },
      );
    }
  }

  // Detail of install status
  checkInstallationProgress() {
    this.Server.progressInstallation(this.$stateParams.productId).then(
      (task) => {
        this.$scope.progress.failStatut = false;

        // doing installation or error installation
        this.$scope.progress.installationTask = task;
        this.$scope.progress.nbStep = task.progress.length;
        this.refreshStepProgress();
        this.startPollReinstall();
      },
      (err) => {
        if (err.status === 404) {
          this.reduce();
        }
        this.$scope.progress.failStatut = true;
        this.startPollReinstall();
      },
    );
  }

  refreshStepProgress() {
    this.$scope.progress.currentStep = '';
    this.$scope.progress.errorMessage = null;
    this.$scope.progress.endStep = 0;
    this.$scope.progress.errorStep = 0;

    this.$scope.progress.installationTask.progress.forEach((value) => {
      if (
        PROGRESS_TASK_STATUS.DOING.includes(
          value.status.toString().toLowerCase(),
        )
      ) {
        if (this.$scope.progress.errorStep === 0) {
          this.$scope.progress.currentStep = value.comment;
        }
        this.$scope.progress.endStep += 1;
      }
      if (
        PROGRESS_TASK_STATUS.ENDING.includes(
          value.status.toString().toLowerCase(),
        )
      ) {
        this.$scope.progress.endStep += 1;
      }
      if (
        PROGRESS_TASK_STATUS.ERROR.includes(
          value.status.toString().toLowerCase(),
        )
      ) {
        this.$scope.progress.disableCancel = true;
        this.$scope.progress.currentStep = value.comment;
        this.$scope.progress.errorMessage = value.error;
        this.$scope.progress.errorStep += 1;
      }
    });
    this.$scope.progress.currentStepNum =
      this.$scope.progress.endStep + this.$scope.progress.errorStep;
    this.$scope.progress.currentStep += ` ( ${this.$scope.progress.currentStepNum} / ${this.$scope.progress.nbStep} )`;
    this.$scope.progress.installationValue =
      ((this.$scope.progress.endStep + this.$scope.progress.errorStep) * 100) /
      this.$scope.progress.nbStep;
  }

  cancelInstall() {
    this.Server.cancelTask(
      this.$stateParams.productId,
      this.$scope.progress.task.id,
    ).then(
      () => {
        this.$scope.progress.disableCancel = true;
        this.$scope.progress.ws = this.$translate.instant(
          'server_configuration_installation_progress_cancel_success',
        );
        this.$scope.serverCtrl.$scope.disable.installationInProgress = false;
      },
      (data) => {
        this.$scope.progress.disableCancel = true;
        this.$scope.progress.wsFail = this.$translate.instant(
          'server_configuration_installation_progress_cancel_fail',
          { t0: data.data.message },
        );
      },
    );
  }

  reduce() {
    this.Polling.addKilledScope(this.$scope.$id);
    this.goBack();
  }
}
