import find from 'lodash/find';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';

import config from '../../config/config';

angular
  .module('App')
  .controller(
    'DedicatedCloudVMwareOptionCtrl',
    ($scope, $stateParams, $q, $translate, DedicatedCloud, User, Poller) => {
      $scope.options = {
        nsx: {
          name: 'nsx',
          loading: true,
          state: null,
          toggable: null,
        },
        vrops: {
          name: 'vrops',
          loading: true,
          state: null,
          toggable: null,
        },
      };

      $scope.loaders = {
        loading: false,
      };

      $scope.polledTasks = {};

      $scope.taskNameToOptionMap = {
        manageVropsUninstall: {
          name: 'vrops',
          toggableMessage: 'dedicatedCloud_options_state_disabling',
        },
        installVrops: {
          name: 'vrops',
          toggableMessage: 'dedicatedCloud_options_state_enabling',
        },
        uninstallVrops: {
          name: 'vrops',
          toggableMessage: 'dedicatedCloud_options_state_disabling',
        },
        enableVropsOptionOnPcc: {
          name: 'vrops',
          toggableMessage: 'dedicatedCloud_options_state_enabling',
        },
        disableVropsOptionOnPcc: {
          name: 'vrops',
          toggableMessage: 'dedicatedCloud_options_state_disabling',
        },
        enableNsxOptionOnPcc: {
          name: 'nsx',
          toggableMessage: 'dedicatedCloud_options_state_enabling',
        },
        disableNsxOptionOnPcc: {
          name: 'nsx',
          toggableMessage: 'dedicatedCloud_options_state_disabling',
        },
        manageNsxInstall: {
          name: 'nsx',
          toggableMessage: 'dedicatedCloud_options_state_enabling',
        },
        manageNsxUninstall: {
          name: 'nsx',
          toggableMessage: 'dedicatedCloud_options_state_disabling',
        },
      };

      $scope.taskStateToPoll = ['todo', 'doing', 'waitingForChilds'];

      function loadOptionStatus(option) {
        return DedicatedCloud.getSelected($stateParams.productId)
          .then((pcc) => pcc.name)
          .then((name) => DedicatedCloud.getOptionState(option.name, name))
          .then((state) => {
            set(option, 'state', state);
            return state;
          })
          .then((state) =>
            DedicatedCloud.isOptionToggable(
              $stateParams.productId,
              option.name,
              state,
            ),
          )
          .then((toggable) => {
            set(option, 'toggable', toggable.toggable);
            if (option.toggable === false) {
              if (toggable.error && toggable.error.status === 403) {
                if (toggable.error.data.message === 'Not available yet') {
                  set(option, 'state', null); // dont show
                } else {
                  set(
                    option,
                    'toggableMessage',
                    $translate.instant(
                      'dedicatedCloud_vmware_option_not_compatible',
                    ),
                  );
                }
              } else if (toggable.error && toggable.error.status === 409) {
                set(
                  option,
                  'toggableMessage',
                  $translate.instant(
                    `dedicatedCloud_vmware_option_not_${
                      option.state === 'enabled' ? 'enabled' : 'disabled'
                    }`,
                  ),
                );
              } else {
                set(
                  option,
                  'toggableMessage',
                  $translate.instant(
                    `dedicatedCloud_options_state_${option.state}`,
                  ),
                );
              }
            }
          })
          .catch((err) => {
            set(option, 'error', err);
            $scope.setMessage(
              $translate.instant('dedicatedCloud_dashboard_loading_error'),
              {
                ...err,
                type: 'error',
              },
            );
          });
      }

      function getGuides() {
        User.getUser().then((user) => {
          $scope.options.nsx.guide =
            config.constants.URLS[user.ovhSubsidiary].presentations.nsx ||
            config.constants.URLS.FR.presentations.nsx;
          $scope.options.vrops.guide =
            config.constants.URLS[user.ovhSubsidiary].presentations.vrops ||
            config.constants.URLS.FR.presentations.vrops;
        });
      }

      function launchPolling(dedicatedCloud, taskId) {
        return Poller.poll(
          `apiv6/dedicatedCloud/${dedicatedCloud.name}/task/${taskId}`,
          null,
          {
            successRule(task) {
              return task.state === 'done';
            },
            errorRule(task) {
              return (
                ['doing', 'todo', 'done', 'waitingForChilds'].indexOf(
                  task.state,
                ) === -1
              );
            },
            namespace: 'dedicatedCloud.options.disable',
          },
        );
      }

      function getTaskOption(task) {
        return $scope.options[$scope.taskNameToOptionMap[task.name].name];
      }

      function pollOptionTasks(dedicatedCloud, tasks) {
        const taskPromiseArray = [];
        angular.forEach(tasks, (task) => {
          const polledTaskIds = flatten($scope.polledTasks);
          if (!find(polledTaskIds, (taskId) => taskId === task.taskId)) {
            taskPromiseArray.push(
              DedicatedCloud.getDedicatedCloudTaskPromise(dedicatedCloud, task),
            );
          }
        });

        return $q.all(taskPromiseArray).then((taskObjects) => {
          angular.forEach(taskObjects, (taskObject) => {
            const taskNamesToPoll = keys($scope.taskNameToOptionMap);

            const isPolledTaskName = find(
              taskNamesToPoll,
              (name) => name === taskObject.name,
            );
            const isPolledState = find(
              $scope.taskStateToPoll,
              (state) => state === taskObject.state,
            );
            if (isPolledTaskName && isPolledState) {
              // eslint-disable-next-line no-use-before-define
              return pollOptionTask(taskObject).then(() => {
                const taskOption = getTaskOption(taskObject);
                taskOption.toggable = false;
                taskOption.toggableMessage = $translate.instant(
                  $scope.taskNameToOptionMap[taskObject.name].toggableMessage,
                );

                if (!$scope.polledTasks[taskOption.name]) {
                  $scope.polledTasks[taskOption.name] = [];
                }
                $scope.polledTasks[taskOption.name].push(taskObject.taskId);
              });
            }
            return null;
          });
        });
      }

      function initTasks() {
        return DedicatedCloud.getSelected($stateParams.productId)
          .then((data) => data)
          .then((dedicatedCloud) =>
            $q.all({
              dedicatedCloud,
              todo: DedicatedCloud.getDedicatedCloudTasksPromise(
                dedicatedCloud,
                'todo',
              ),
              doing: DedicatedCloud.getDedicatedCloudTasksPromise(
                dedicatedCloud,
                'doing',
              ),
            }),
          )
          .then((data) => {
            const tasks = data.todo.concat(data.doing);
            return pollOptionTasks(data.dedicatedCloud, tasks);
          });
      }

      function pollOptionTask(task) {
        let dedicatedCloud = null;
        return DedicatedCloud.getSelected($stateParams.productId).then(
          (data) => {
            dedicatedCloud = data;
            const taskOption = getTaskOption(task);
            launchPolling(dedicatedCloud, task.taskId)
              .then(() => {
                const index = $scope.polledTasks[taskOption.name].indexOf(
                  task.taskId,
                );
                $scope.polledTasks[taskOption.name].splice(index, 1);

                // We check if the done task spawned any interesting new tasks.
                return initTasks();
              })
              .then(() => {
                if ($scope.polledTasks[taskOption.name].length === 0) {
                  // If no further tasks are found, it means that the task is done. We refresh the status.
                  loadOptionStatus(taskOption);
                }
              });
          },
        );
      }

      $scope.$on('vmware-option-disable', (event, option) => {
        const toggable = DedicatedCloud.isOptionToggable(
          $stateParams.productId,
          option,
          'disabling',
        );
        $scope.options[option].state = 'disabling';
        $scope.options[option].toggable = toggable.toggable;
        $scope.options[option].toggableMessage = $translate.instant(
          'dedicatedCloud_options_state_disabling',
        );
        initTasks();
      });

      $scope.$on('vmware-option-enable', (event, option) => {
        const toggable = DedicatedCloud.isOptionToggable(
          $stateParams.productId,
          option,
          'enabling',
        );
        $scope.options[option].state = 'enabling';
        $scope.options[option].toggable = toggable.toggable;
        $scope.options[option].toggableMessage = $translate.instant(
          'dedicatedCloud_options_state_enabling',
        );
        initTasks();
      });

      $scope.loadOptionsStatus = function loadOptionsStatus() {
        const loadOptionsTasks = map($scope.options, (option) =>
          loadOptionStatus(option),
        );
        return $q.all(loadOptionsTasks);
      };

      (function init() {
        getGuides();

        $scope.loaders.loading = true;
        $scope.options.nsx.loading = true;
        $scope.options.vrops.loading = true;

        $scope
          .loadOptionsStatus()
          .then(initTasks)
          .finally(() => {
            $scope.loaders.loading = false;
            $scope.options.nsx.loading = false;
            $scope.options.vrops.loading = false;
          });
      })();
    },
  );
