import get from 'lodash/get';
import set from 'lodash/set';
import head from 'lodash/head';
import includes from 'lodash/includes';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

import {
  BYOI_STATUS_ENUM,
  BYOI_STARTING_MESSAGE,
} from './constants';

const doingStatus = ['doing'];
const endingStatus = ['done'];
const errorStatus = ['customer_error', 'ovh_error', 'error', 'cancelled'];

export default class BmServerComponentsOsInstallProgressCtrl {
  /* @ngInject */
  constructor($scope, $translate, $q, osInstallProgressService, Polling) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$q = $q;
    this.osInstallProgressService = osInstallProgressService;
    this.Polling = Polling;
  }

  $onInit() {
    this.progress = {
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

    this.noInstallationInProgress = false;
    this.isLoading = false;
    this.load();
  }

  $onDestroy() {
    this.killPolling();
  }

  // task of installation
  startPollReinstall() {
    if (this.progress.task) {
      // Doing installation
      this.addTaskFast(
        this.serviceName,
        this.progress.task,
        this.$scope.$id,
      ).then((state) => {
        if (this.Polling.isResolve(state)) {
          this.progress.task = null;
        }
        this.checkInstallationProgress();
      })
      .catch(() => {
        this.reduce();
      });
    }
  }

  // Detail of install status
  checkInstallationProgress() {
    // if task status is init, it's maybe because of byoi install
    // (which does not have status response yet).
    // we have to wait that the message of byoi change from 'starting' to anything else in
    // order to have a response from status API.
    if (this.isBringYourOwnImageInit()) {
      this.startPollReinstall();
    } else {
      this.osInstallProgressService.progressInstallation(this.serviceName)
        .then((task) => {
          this.progress.failStatut = false;

          // doing installation or error installation
          this.progress.installationTask = task;
          this.progress.nbStep = task.progress.length;
          this.refreshStepProgress();
          this.startPollReinstall();
        })
        .catch((error) => {
          if (error.status === 404) {
            this.reduce();
          }
          this.progress.failStatut = true;
          this.startPollReinstall();
        });
    }
  }

  isBringYourOwnImageInit() {
    return (
      get(this.progress.task, 'status') === 'init' &&
      get(this.byoi, 'status') === BYOI_STATUS_ENUM.DOING &&
      get(this.byoi, 'message') === BYOI_STARTING_MESSAGE
    );
  };

  load() {
    this.isLoading = true;
    this.osInstallProgressService.getTaskInProgress(
      this.serviceName,
      'reinstallServer',
    ).then((taskTab) => {
      if (taskTab.length > 0) {
        this.progress.task = head(taskTab);
        // $rootScope.$broadcast(
        //   'dedicated.informations.reinstall',
        //   taskTab[0],
        // );
      }
      this.checkInstallationProgress();
    })
    .catch((error) => {
      // this.resetAction();
      if (error.status === 404) {
        this.noInstallationInProgress = true;
      }
    })
    .finally(() => {
      this.isLoading = false;
    });
  };

  refreshStepProgress() {
    this.progress.currentStep = '';
    this.progress.errorMessage = null;
    this.progress.endStep = 0;
    this.progress.errorStep = 0;

    forEach(this.progress.installationTask.progress, (value) => {
      if (includes(doingStatus, value.status.toString().toLowerCase())) {
        if (this.progress.errorStep === 0) {
          this.progress.currentStep = value.comment;
        }
        this.progress.endStep += 1;
      }
      if (includes(endingStatus, value.status.toString().toLowerCase())) {
        this.progress.endStep += 1;
      }
      if (includes(errorStatus, value.status.toString().toLowerCase())) {
        this.progress.disableCancel = true;
        this.progress.currentStep = value.comment;
        this.progress.errorMessage = value.error;
        this.progress.errorStep += 1;
      }
    });
    this.progress.currentStepNum =
      this.progress.endStep + this.progress.errorStep;
    this.progress.currentStep += ` ( ${this.progress.currentStepNum} / ${this.progress.nbStep} )`;
    this.progress.installationValue =
      ((this.progress.endStep + this.progress.errorStep) * 100) /
      this.progress.nbStep;
  };

  cancelInstall() {
    this.osInstallProgressService.cancelTask(this.serviceName, this.progress.task.id)
      .then(() => {
        this.progress.disableCancel = true;
        this.progress.ws = this.$translate.instant(
          'server_configuration_installation_progress_cancel_success',
        );
        // this.serverCtrl.this.disable.installationInProgress = false;
        this.handleOnCancel();
      })
      .catch((error) => {
        this.progress.disableCancel = true;
        this.progress.wsFail = this.$translate.instant(
          'server_configuration_installation_progress_cancel_fail',
          { t0: error.message || error.data?.message },
        );
      });
  };

  reduce() {
    this.killPolling();
    this.goBack();
    // $scope.resetAction();
  };

  killPolling() {
    this.Polling.addKilledScope(this.$scope.$id);
  }

  addTaskFast(productId, task, scopeId) {
    set(task, 'id', task.id || task.taskId);
    const pollPromise = this.$q.defer();

    this.Polling.addTaskFast(
      this.constructor.getTaskPath(productId, task.id),
      task,
      scopeId,
    )
      .then((state) => {
        pollPromise.resolve(state);
        if (this.Polling.isDone(state)) {
          // this.$rootScope.$broadcast('tasks.update');
        }
      })
      .catch((data) => {
        pollPromise.reject(data);
        // this.$rootScope.$broadcast('tasks.update');
      });

    return pollPromise.promise;
  }

  static getTaskPath(productId, taskId) {
    return `apiv6/dedicated/server/${productId}/task/${taskId}`;
  }

  goBack() {
    if (isFunction(this.onGoBack)) {
      this.onGoBack();
    }
  }

  handleOnCancel() {
    if (isFunction(this.onCancel)) {
      this.onCancel();
    }
  }

}
