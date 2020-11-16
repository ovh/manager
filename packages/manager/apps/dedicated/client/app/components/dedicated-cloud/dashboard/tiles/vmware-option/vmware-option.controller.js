import find from 'lodash/find';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../../../datacenter/drp/dedicatedCloud-datacenter-drp.constants';

import config from '../../../../../config/config';

export default class {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud, dedicatedCloudDrp, User, Poller) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.Poller = Poller;
    this.User = User;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DRP_VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    this.options = {
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

    this.loaders = {
      loading: false,
    };

    this.polledTasks = {};

    this.taskNameToOptionMap = {
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

    this.taskStateToPoll = ['todo', 'doing', 'waitingForChilds'];

    this.getGuides();
    this.getDrpStatus();

    this.loaders.loading = true;
    this.options.nsx.loading = true;
    this.options.vrops.loading = true;

    this.loadOptionsStatus()
      .then(() => this.initTasks())
      .finally(() => {
        this.loaders.loading = false;
        this.options.nsx.loading = false;
        this.options.vrops.loading = false;
      });
  }

  getDrpStatus() {
    this.drpStatus = this.currentDrp.state;
    this.drpRemotePccStatus =
      this.currentDrp.drpType === this.DRP_OPTIONS.ovh
        ? this.dedicatedCloudDrp.constructor.formatStatus(
            get(this.currentDrp, 'remoteSiteInformation.state'),
          )
        : this.DRP_STATUS.delivered;
  }

  loadOptionStatus(option) {
    return this.DedicatedCloud.getSelected(this.productId)
      .then((pcc) => pcc.name)
      .then((name) => this.DedicatedCloud.getOptionState(option.name, name))
      .then((state) => {
        set(option, 'state', state);
        return state;
      })
      .then((state) =>
        this.DedicatedCloud.isOptionToggable(
          this.productId,
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
                this.$translate.instant(
                  'dedicatedCloud_vmware_option_not_compatible',
                ),
              );
            }
          } else if (toggable.error && toggable.error.status === 409) {
            set(
              option,
              'toggableMessage',
              this.$translate.instant(
                `dedicatedCloud_vmware_option_not_${
                  option.state === 'enabled' ? 'enabled' : 'disabled'
                }`,
              ),
            );
          } else {
            set(
              option,
              'toggableMessage',
              this.$translate.instant(
                `dedicatedCloud_options_state_${option.state}`,
              ),
            );
          }
        }
      })
      .catch((err) => {
        set(option, 'error', err);
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_dashboard_loading_error',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }

  getGuides() {
    return this.User.getUser().then((user) => {
      this.options.nsx.guide =
        config.constants.URLS[user.ovhSubsidiary].presentations.nsx ||
        config.constants.URLS.FR.presentations.nsx;
      this.options.vrops.guide =
        config.constants.URLS[user.ovhSubsidiary].presentations.vrops ||
        config.constants.URLS.FR.presentations.vrops;
    });
  }

  launchPolling(dedicatedCloud, taskId) {
    return this.Poller.poll(
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

  getTaskOption(task) {
    return this.options[this.taskNameToOptionMap[task.name].name];
  }

  pollOptionTasks(dedicatedCloud, tasks) {
    const taskPromiseArray = [];
    angular.forEach(tasks, (task) => {
      const polledTaskIds = flatten(this.polledTasks);
      if (!find(polledTaskIds, (taskId) => taskId === task.taskId)) {
        taskPromiseArray.push(
          this.DedicatedCloud.getDedicatedCloudTaskPromise(
            dedicatedCloud,
            task,
          ),
        );
      }
    });

    return this.$q.all(taskPromiseArray).then((taskObjects) => {
      angular.forEach(taskObjects, (taskObject) => {
        const taskNamesToPoll = keys(this.taskNameToOptionMap);

        const isPolledTaskName = find(
          taskNamesToPoll,
          (name) => name === taskObject.name,
        );
        const isPolledState = find(
          this.taskStateToPoll,
          (state) => state === taskObject.state,
        );
        if (isPolledTaskName && isPolledState) {
          // eslint-disable-next-line no-use-before-define
          return this.pollOptionTask(taskObject).then(() => {
            const taskOption = this.getTaskOption(taskObject);
            taskOption.toggable = false;
            taskOption.toggableMessage = this.$translate.instant(
              this.taskNameToOptionMap[taskObject.name].toggableMessage,
            );

            if (!this.polledTasks[taskOption.name]) {
              this.polledTasks[taskOption.name] = [];
            }
            this.polledTasks[taskOption.name].push(taskObject.taskId);
          });
        }
        return null;
      });
    });
  }

  initTasks() {
    return this.DedicatedCloud.getSelected(this.productId)
      .then((data) => data)
      .then((dedicatedCloud) =>
        this.$q.all({
          dedicatedCloud,
          todo: this.DedicatedCloud.getDedicatedCloudTasksPromise(
            dedicatedCloud,
            'todo',
          ),
          doing: this.DedicatedCloud.getDedicatedCloudTasksPromise(
            dedicatedCloud,
            'doing',
          ),
        }),
      )
      .then((data) => {
        const tasks = data.todo.concat(data.doing);
        return this.pollOptionTasks(data.dedicatedCloud, tasks);
      });
  }

  pollOptionTask(task) {
    let dedicatedCloud = null;
    return this.DedicatedCloud.getSelected(this.productId).then((data) => {
      dedicatedCloud = data;
      const taskOption = this.getTaskOption(task);
      this.launchPolling(dedicatedCloud, task.taskId)
        .then(() => {
          const index = this.polledTasks[taskOption.name].indexOf(task.taskId);
          this.polledTasks[taskOption.name].splice(index, 1);

          // We check if the done task spawned any interesting new tasks.
          return this.initTasks();
        })
        .then(() => {
          if (this.polledTasks[taskOption.name].length === 0) {
            // If no further tasks are found, it means that the task is done. We refresh the status.
            this.loadOptionStatus(taskOption);
          }
        });
    });
  }

  loadOptionsStatus() {
    const loadOptionsTasks = map(this.options, (option) =>
      this.loadOptionStatus(option),
    );
    return this.$q.all(loadOptionsTasks);
  }

  chooseDatacenterForDrp() {
    if (this.datacenterList.length === 1) {
      const [{ id: datacenterId }] = this.datacenterList;
      return this.goToDrp(datacenterId);
    }

    return this.goToDrpDatacenterSelection();
  }
}
