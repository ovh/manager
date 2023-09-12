import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';

import {
  BYOI_STATUS_ENUM,
  BYOI_STARTING_MESSAGE,
} from '../../details/server.constants';

angular
  .module('App')
  .controller(
    'ServerInstallationProgressCtrl',
    ($scope, $translate, Server, Polling, $rootScope, $stateParams) => {
      const doingStatus = ['doing'];
      const endingStatus = ['done'];

      // waitingStatus = ["init", "todo"]
      const errorStatus = ['customer_error', 'ovh_error', 'error', 'cancelled'];

      $scope.serverCtrl = $scope.currentActionData.serverCtrl;

      $scope.progress = {
        server: $scope.currentActionData.server,
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

      // task of installation
      function startPollReinstall() {
        if ($scope.progress.task) {
          // Doing installation
          Server.addTaskFast(
            $stateParams.productId,
            $scope.progress.task,
            $scope.$id,
          ).then(
            (state) => {
              if (Polling.isResolve(state)) {
                $scope.progress.task = null;
              }
              // eslint-disable-next-line no-use-before-define
              checkInstallationProgress();
            },
            () => {
              $scope.reduce();
            },
          );
        }
      }

      // Detail of install status
      function checkInstallationProgress() {
        // if task status is init, it's maybe because of byoi install
        // (which does not have status response yet).
        // we have to wait that the message of byoi change from 'starting' to anything else in
        // order to have a response from status API.
        if ($scope.isBringYourOwnImageInit()) {
          startPollReinstall();
        } else {
          Server.progressInstallation($stateParams.productId).then(
            (task) => {
              $scope.progress.failStatut = false;

              // doing installation or error installation
              $scope.progress.installationTask = task;
              $scope.progress.nbStep = task.progress.length;
              $scope.refreshStepProgress();
              startPollReinstall();
            },
            (err) => {
              if (err.status === 404) {
                $scope.reduce();
              }
              $scope.progress.failStatut = true;
              startPollReinstall();
            },
          );
        }
      }

      $scope.isBringYourOwnImageInit = function isBringYourOwnImageInit() {
        return (
          get($scope.progress.task, 'status') === 'init' &&
          get($scope.serverCtrl.$scope.byoi, 'status') ===
            BYOI_STATUS_ENUM.DOING &&
          get($scope.serverCtrl.$scope.byoi, 'message') ===
            BYOI_STARTING_MESSAGE
        );
      };

      $scope.load = function load() {
        Server.getTaskInProgress(
          $stateParams.productId,
          'reinstallServer',
        ).then(
          (taskTab) => {
            if (taskTab.length > 0) {
              $scope.progress.task = head(taskTab);
              $rootScope.$broadcast(
                'dedicated.informations.reinstall',
                taskTab[0],
              );
            }
            checkInstallationProgress();
          },
          () => {
            $scope.resetAction();
          },
        );
      };

      $scope.refreshStepProgress = function refreshStepProgress() {
        $scope.progress.currentStep = '';
        $scope.progress.errorMessage = null;
        $scope.progress.endStep = 0;
        $scope.progress.errorStep = 0;

        angular.forEach($scope.progress.installationTask.progress, (value) => {
          if (includes(doingStatus, value.status.toString().toLowerCase())) {
            if ($scope.progress.errorStep === 0) {
              $scope.progress.currentStep = value.comment;
            }
            $scope.progress.endStep += 1;
          }
          if (includes(endingStatus, value.status.toString().toLowerCase())) {
            $scope.progress.endStep += 1;
          }
          if (includes(errorStatus, value.status.toString().toLowerCase())) {
            $scope.progress.disableCancel = true;
            $scope.progress.currentStep = value.comment;
            $scope.progress.errorMessage = value.error;
            $scope.progress.errorStep += 1;
          }
        });
        $scope.progress.currentStepNum =
          $scope.progress.endStep + $scope.progress.errorStep;
        $scope.progress.currentStep += ` ( ${$scope.progress.currentStepNum} / ${$scope.progress.nbStep} )`;
        $scope.progress.installationValue =
          (($scope.progress.endStep + $scope.progress.errorStep) * 100) /
          $scope.progress.nbStep;
      };

      $scope.cancelInstall = function cancelInstall() {
        Server.cancelTask($stateParams.productId, $scope.progress.task.id).then(
          () => {
            $scope.progress.disableCancel = true;
            $scope.progress.ws = $translate.instant(
              'server_configuration_installation_progress_cancel_success',
            );
            $scope.serverCtrl.$scope.disable.installationInProgress = false;
          },
          (data) => {
            $scope.progress.disableCancel = true;
            $scope.progress.wsFail = $translate.instant(
              'server_configuration_installation_progress_cancel_fail',
              { t0: data.data.message },
            );
          },
        );
      };

      $scope.reduce = function reduce() {
        Polling.addKilledScope($scope.$id);
        $scope.resetAction();
      };

      $scope.$on('$destroy', () => {
        Polling.addKilledScope($scope.$id);
      });
    },
  );
