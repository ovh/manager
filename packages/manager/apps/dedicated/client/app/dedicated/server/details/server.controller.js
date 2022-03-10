import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import {
  NO_AUTORENEW_COUNTRIES,
  BYOI_STARTING_MESSAGE,
  BYOI_STATUS_ENUM,
} from './server.constants';

export default class ServerCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    constants,
    coreURLBuilder,
    ovhUserPref,
    Poller,
    Polling,
    Server,
    User,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.constants = constants;
    this.coreURLBuilder = coreURLBuilder;
    this.ovhUserPref = ovhUserPref;
    this.Poller = Poller;
    this.Polling = Polling;
    this.Server = Server;
    this.User = User;
  }

  $onInit() {
    this.errorStatus = ['customer_error', 'ovh_error', 'error', 'cancelled'];

    this.$scope.RENEW_URL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/autoRenew',
    );

    this.$scope.$state = this.$state;

    this.$scope.server = this.server;
    this.$scope.serviceInfos = this.serviceInfos;
    this.$scope.specifications = this.specifications;
    this.$scope.worldPart = this.worldPart;
    this.$scope.byoi = this.bringYourOwnImage; // to be burned on reinstall refactor!!!

    this.$scope.loaders = {
      autoRenew: true,
    };

    this.$scope.disable = {
      reboot: false,
      byOtherTask: false,
      install: false,
      installationInProgress: false,
      installationInProgressError: false,
      noDeleteMessage: false,
      usbStorageTab: false,
    };

    this.$scope.bigModalDialog = false;

    this.$scope.autoRenew = null;
    this.$scope.autoRenewStopBother = true;
    this.$scope.autoRenewable = false;
    this.$scope.autoRenewGuide = null;
    this.$scope.hasPaymentMean = false;

    this.$scope.housingPhoneStopBother = true;
    this.$scope.housingPhoneNumber = this.constants.urls.FR.housingPhoneSupport;
    this.$scope.isHousing = false;

    this.$scope.setToBigModalDialog = (active) => {
      this.$scope.mediumModalDialog = false;
      this.$scope.bigModalDialog = active;
    };

    this.$scope.resetAction = () => {
      this.$scope.setAction(false);
      this.$scope.setToBigModalDialog(false);
    };

    this.$scope.$on('$locationChangeStart', () => {
      this.$scope.resetAction();
    });

    this.$scope.setMessage = (message, data) => {
      let messageToSend = message;
      let i = 0;
      this.$scope.alertType = '';

      if (data) {
        if (data.message) {
          messageToSend += ` (${data.message})`;
          switch (data.type) {
            case 'ERROR':
              this.$scope.alertType = 'alert-danger';
              break;
            case 'WARNING':
              this.$scope.alertType = 'alert-warning';
              break;
            case 'INFO':
              this.$scope.alertType = 'alert-success';
              break;
            default:
              break;
          }
        } else if (data.messages) {
          if (data.messages.length > 0) {
            switch (data.state) {
              case 'ERROR':
                this.$scope.alertType = 'alert-danger';
                break;
              case 'PARTIAL':
                this.$scope.alertType = 'alert-warning';
                break;
              case 'OK':
                this.$scope.alertType = 'alert-success';
                break;
              default:
                break;
            }

            messageToSend += ' (';

            for (i; i < data.messages.length; i += 1) {
              messageToSend += `${data.messages[i].id} : ${
                data.messages[i].message
              }${data.messages.length === i + 1 ? ')' : ', '}`;
            }
          }
        } else if (data.idTask && data.state) {
          switch (data.state) {
            case 'BLOCKED':
            case 'blocked':
            case 'CANCELLED':
            case 'cancelled':
            case 'PAUSED':
            case 'paused':
            case 'ERROR':
            case 'error':
              this.$scope.alertType = 'alert-danger';
              break;
            case 'WAITING_ACK':
            case 'waitingAck':
            case 'DOING':
            case 'doing':
              this.$scope.alertType = 'alert-warning';
              break;
            case 'TODO':
            case 'todo':
            case 'DONE':
            case 'done':
              this.$scope.alertType = 'alert-success';
              break;
            default:
              break;
          }
        } else if (data === 'true' || data === true) {
          this.$scope.alertType = 'alert-success';
        } else if (data.type) {
          switch (data.type) {
            case 'ERROR':
              this.$scope.alertType = 'alert-danger';
              break;
            case 'WARNING':
              this.$scope.alertType = 'alert-warning';
              break;
            case 'INFO':
              this.$scope.alertType = 'alert-success';
              break;
            default:
              break;
          }
        }
      } else if (data === 'false' || data === false) {
        this.$scope.alertType = 'alert-danger';
      }

      this.$scope.message = messageToSend;
    };

    this.$scope.setAction = (action, data) => {
      if (action) {
        this.$scope.currentAction = action;
        this.$scope.currentActionData = data;

        this.$scope.stepPath = `dedicated/server/${this.$scope.currentAction}.html`;

        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    };

    this.$scope.$on('dedicated.informations.reload', (e, params) => {
      if (
        params &&
        Object.prototype.hasOwnProperty.call(params, 'monitoring')
      ) {
        this.server.monitored = params.monitoring;
      }
      if (
        params &&
        Object.prototype.hasOwnProperty.call(params, 'noIntervention')
      ) {
        this.server.noIntervention = params.noIntervention;
      }
      this.loadServer();
    });

    this.$scope.$on('$destroy', () => {
      this.Polling.addKilledScope();
      this.Poller.kill({
        namespace: 'byoi_poller',
      });
    });

    // Server Restart
    this.$scope.$on('dedicated.informations.reboot', (e, _task) => {
      let task = _task;
      this.$scope.disable.reboot = true;
      task = task.data ? task.data : task;
      task.id = task.taskId;
      this.startPollRestart(task);
    });

    // Server Install
    this.$scope.$on('dedicated.informations.reinstall', (e, task) => {
      if (!this.$scope.disable.install) {
        this.$scope.disable.install = true;
        this.checkInstallationProgress(task);
      }
    });

    // Auto renew
    this.$scope.hasAutoRenew = () => {
      this.$scope.autoRenew = false;
      if (
        NO_AUTORENEW_COUNTRIES.indexOf(this.$scope.user.ovhSubsidiary) === -1
      ) {
        return this.$q
          .all({
            serverServiceInfo: this.Server.getServiceInfos(
              this.$stateParams.productId,
            ),
            isAutoRenewable: this.Server.isAutoRenewable(
              this.$stateParams.productId,
            ),
          })
          .then((results) => {
            this.$scope.autoRenew =
              results.serverServiceInfo.renew &&
              results.serverServiceInfo.renew.automatic;
            this.$scope.autoRenewable = results.isAutoRenewable;
            this.$scope.autoRenewGuide =
              this.constants.urls[this.$scope.user.ovhSubsidiary].guides
                .autoRenew || this.constants.urls.FR.guides.autoRenew;
            this.$scope.checkIfStopBotherAutoRenew();
          });
      }
      return this.$q.when(true);
    };

    this.$scope.stopBotherAutoRenew = () => {
      this.$scope.autoRenewStopBother = true;
      let serverArrayToStopBother = [];

      this.ovhUserPref
        .getValue('SERVER_AUTORENEW_STOP_BOTHER')
        .then((data) => {
          serverArrayToStopBother = data;
          return this.Server.getSelected(this.$stateParams.productId);
        })
        .then((dedicatedServer) => {
          serverArrayToStopBother.push(dedicatedServer.name);
          return this.ovhUserPref.assign(
            'SERVER_AUTORENEW_STOP_BOTHER',
            serverArrayToStopBother,
          );
        })
        .catch((error) =>
          error.status === 404
            ? this.$scope.createStopBotherAutoRenewUserPref()
            : this.$scope.setMessage(
                this.$translate.instant('server_autorenew_stop_bother_error'),
                error.data,
              ),
        );
    };

    this.$scope.createStopBotherAutoRenewUserPref = () => {
      this.ovhUserPref.create('SERVER_AUTORENEW_STOP_BOTHER', [
        this.$scope.server.name,
      ]);
    };

    this.$scope.checkIfStopBotherAutoRenew = () =>
      this.ovhUserPref
        .getValue('SERVER_AUTORENEW_STOP_BOTHER')
        .then((serverToStopBother) => {
          this.$scope.autoRenewStopBother =
            indexOf(serverToStopBother, this.$scope.server.name) !== -1;
        })
        // eslint-disable-next-line no-return-assign
        .catch((error) =>
          error.status === 404
            ? (this.$scope.autoRenewStopBother = false)
            : this.$q.reject(error),
        );

    // IPMI Restart (other task by tab)
    this.$scope.$on('dedicated.ipmi.resetinterfaces', (e, task) => {
      this.initIpmiRestart(task);
    });

    this.$scope.createStopBotherUserPref = () => {
      this.ovhUserPref.create('HOUSING_SUPPORT_PHONE_STOP_BOTHER', true);
    };

    // poll for BYOI
    // polling must be started if status of byoi is in doing and the message is starting
    if (
      get(this.bringYourOwnImage, 'status') === BYOI_STATUS_ENUM.DOING &&
      get(this.bringYourOwnImage, 'message') === BYOI_STARTING_MESSAGE
    ) {
      this.launchBringYourOwnImagePolling();
    }

    this.load();
  }

  load() {
    this.$scope.loaders.autoRenew = true;

    this.$q
      .all({
        user: this.User.getUser(),
        paymentIds:
          this.worldPart !== 'US'
            ? this.User.getValidPaymentMeansIds()
            : this.$q.when([]),
      })
      .then((data) => {
        this.$scope.user = data.user;
        this.$scope.hasPaymentMean = data.paymentIds.length > 0;
        this.$scope.hasAutoRenew();
        this.checkIfStopBotherHousingPhone();
      })
      .finally(() => {
        this.$scope.loaders.autoRenew = false;
      });

    this.loadServer()
      .then(() => this.getTaskInProgress())
      .finally(() => {
        if (this.$scope.server.canTakeRendezVous) {
          this.$state.go('app.dedicated-server.server.rendezvous');
        }
      });
  }

  loadServer() {
    if (!this.$scope.disable.noDeleteMessage) {
      this.$scope.message = null;
    } else {
      this.$scope.disable.noDeleteMessage = false;
    }

    const expiration = moment.utc(this.$scope.server.expiration);

    set(
      this.$scope.server,
      'expiration',
      moment([
        expiration.year(),
        expiration.month(),
        expiration.date(),
      ]).toDate(),
    );

    const creation = moment.utc(this.serviceInfos.creation);

    set(
      this.$scope.server,
      'creation',
      moment([creation.year(), creation.month(), creation.date()]).toDate(),
    );

    /* if there is no os installed, the api return "none_64" */
    if (/^none_\d{2}?$/.test(this.server.os)) {
      this.$scope.server.os = null;
    }

    this.$scope.isHousing = ServerCtrl.isHousing(this.server);

    this.$scope.$broadcast('dedicated.server.refreshTabs');

    return this.Server.getUsbStorageInformations(
      this.$stateParams.productId,
    ).then((usbStorageInformations) => {
      if (
        isArray(usbStorageInformations) &&
        usbStorageInformations[1].usbKeys
      ) {
        this.$scope.disable.usbStorageTab = true;
      }
    });
  }

  getTaskInProgress() {
    return this.$q
      .all({
        hardRebootTasks: this.Server.getTaskInProgress(
          this.$stateParams.productId,
          'hardReboot',
        ),
        resetIPMITasks: this.Server.getTaskInProgress(
          this.$stateParams.productId,
          'resetIPMI',
        ),
        reinstallServerTasks: this.Server.getTaskInProgress(
          this.$stateParams.productId,
          'reinstallServer',
        ),
      })
      .then(({ hardRebootTasks, resetIPMITasks, reinstallServerTasks }) => {
        if (isArray(hardRebootTasks) && !isEmpty(hardRebootTasks)) {
          this.$scope.$broadcast(
            'dedicated.informations.reboot',
            hardRebootTasks[0],
          );
        }

        // Do not call broadcast dedicated.ipmi.resetinterfaces
        if (isArray(resetIPMITasks) && !isEmpty(resetIPMITasks)) {
          this.initIpmiRestart(resetIPMITasks[0]);
        }

        if (isArray(reinstallServerTasks) && !isEmpty(reinstallServerTasks)) {
          this.$scope.$broadcast(
            'dedicated.informations.reinstall',
            reinstallServerTasks[0],
          );
        } else if (!has(reinstallServerTasks, 'messages')) {
          this.checkInstallationProgress();
        } else {
          this.$scope.$broadcast('dedicated.server.refreshTabs');
        }
      });
  }

  startPollRestart(task) {
    this.Server.addTask(this.$stateParams.productId, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.$scope.disable.reboot = false;
          this.$scope.$broadcast('dedicated.informations.reboot.done');
          this.$scope.setMessage(
            this.$translate.instant('server_configuration_reboot_successfull', {
              t0: this.$scope.server.name,
            }),
            true,
          );
        } else {
          this.startPollRestart(task);
        }
      })
      .catch((data) => {
        this.$scope.disable.reboot = false;
        this.$scope.$broadcast('dedicated.informations.reboot.done');
        this.$scope.setMessage(
          this.$translate.instant('server_configuration_reboot_fail_task'),
          {
            ...data,
            type: 'ERROR',
          },
        );
      });
  }

  checkInstallationProgress(task) {
    this.Server.progressInstallation(this.$stateParams.productId)
      .then((installationStep) => {
        this.$scope.disable.installationInProgress = true;
        this.$scope.disable.installationInProgressError = false;
        angular.forEach(installationStep.progress, (value) => {
          if (
            includes(this.errorStatus, value.status.toString().toLowerCase())
          ) {
            this.$scope.disable.installationInProgressError = value.error;
            this.$scope.disable.install = false;
          }
        });

        if (!this.$scope.disable.installationInProgressError && task) {
          this.startPollReinstall(task);
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          if (this.$scope.disable.installationInProgress) {
            this.$scope.disable.noDeleteMessage = true;
            this.$scope.setMessage(
              this.$translate.instant(
                'server_configuration_installation_progress_end',
              ),
              true,
            );
            this.$scope.$broadcast('dedicated.informations.reload');
          }

          this.$scope.disable.install = false;
          this.$scope.disable.installationInProgress = false;
          this.$scope.disable.installationInProgressError = false;
          this.$scope.$broadcast('dedicated.server.refreshTabs');
          return;
        }

        if (task) {
          this.startPollReinstall(task);
        } else {
          this.$scope.setMessage(
            this.$translate.instant(
              'server_configuration_installation_fail_task',
              { t0: this.$scope.server.name },
            ),
            false,
          );
        }
      });
  }

  startPollReinstall(task) {
    this.Server.addTask(this.$stateParams.productId, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          if (this.Polling.isDone(state)) {
            this.checkInstallationProgress();
          }
        } else {
          this.checkInstallationProgress(task);
        }
      })
      .catch((data) => {
        this.$scope.disable.install = false;
        this.$scope.setMessage(
          this.$translate.instant(
            'server_configuration_installation_fail_task',
            {
              t0: this.$scope.server.name,
            },
          ),
          {
            ...data,
            type: 'ERROR',
          },
        );
      });
  }

  initIpmiRestart(task) {
    this.$scope.disable.byOtherTask = true;
    this.startIpmiPollRestart(task);
  }

  startIpmiPollRestart(task) {
    this.$scope.disable.byOtherTask = true;

    this.Server.addTaskFast(this.$stateParams.productId, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.$scope.disable.byOtherTask = false;
        } else {
          this.startIpmiPollRestart(task);
        }
      })
      .catch(() => {
        this.$scope.disable.byOtherTask = false;
      });
  }

  launchBringYourOwnImagePolling() {
    this.Poller.poll(
      `/dedicated/server/${this.server.name}/bringYourOwnImage`,
      null,
      {
        namespace: 'byoi_poller',
        successRule: (byoi) => {
          return (
            byoi.status === BYOI_STATUS_ENUM.DOING &&
            byoi.message !== BYOI_STARTING_MESSAGE
          );
        },
      },
    ).then(
      (byoi) => {
        this.$scope.byoi = byoi;
      },
      () => {
        this.$scope.disable.install = false;
        this.$scope.disable.installationInProgress = false;
      },
      (byoi) => {
        this.$scope.byoi = byoi;
        this.$scope.disable.install = true;
        this.$scope.disable.installationInProgress = true;
      },
    );
  }

  checkIfStopBotherHousingPhone() {
    return this.ovhUserPref
      .getValue('HOUSING_SUPPORT_PHONE_STOP_BOTHER')
      .then((stopBother) => {
        this.$scope.housingPhoneStopBother = stopBother;
      })
      .catch(() => {
        this.$scope.housingPhoneStopBother = false;
      });
  }

  getTabItemUrl(tabItemName) {
    return this.$state.href(`app.dedicated-server.server.${tabItemName}`);
  }

  static isHousing(dedicatedServer) {
    return dedicatedServer.commercialRange === 'housing';
  }

  getNutanixClusterDashboardLink(clusterServiceName) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/nutanix/${clusterServiceName}`,
    );
  }

  getNutanixClusterNodeLink(clusterServiceName, nodeServiceName) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/nutanix/${clusterServiceName}/nodes/${nodeServiceName}`,
    );
  }
}
