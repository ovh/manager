import has from 'lodash/has';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { ELIGIBLE_FOR_UPGRADE, URLS } from './dedicated-server.contants';

/* eslint-disable no-use-before-define */
angular.module('App').controller('ServerCtrl', /* @ngInject */ (
  $q,
  $scope,
  $state,
  $stateParams,
  $timeout,
  $translate,
  constants,
  coreConfig,
  dedicatedServerFeatureAvailability,
  ola,
  orderPrivateBandwidthLink,
  orderPublicBandwidthLink,
  ovhUserPref,
  Polling,
  resiliatePublicBandwidthLink,
  resiliatePrivateBandwidthLink,
  Server,
  server,
  specifications,
  User,
  NO_AUTORENEW_COUNTRIES,
  WEATHERMAP_URL,
) => {
  const errorStatus = ['customer_error', 'ovh_error', 'error', 'cancelled'];

  $scope.$state = $state;
  $scope.server = server;
  $scope.specifications = specifications;
  $scope.ola = ola;
  $scope.orderPrivateBandwidthLink = orderPrivateBandwidthLink;
  $scope.orderPublicBandwidthLink = orderPublicBandwidthLink;
  $scope.resiliatePublicBandwidthLink = resiliatePublicBandwidthLink;
  $scope.resiliatePrivateBandwidthLink = resiliatePrivateBandwidthLink;

  $scope.loadingServerInformations = true;
  $scope.loadingServerError = false;
  $scope.dedicatedServerFeatureAvailability = dedicatedServerFeatureAvailability;

  $scope.loaders = {
    autoRenew: true,
  };

  $scope.disable = {
    reboot: false,
    byOtherTask: false,
    install: false,
    installationInProgress: false,
    installationInProgressError: false,
    noDeleteMessage: false,
    usbStorageTab: false,
  };
  $scope.urlRenew = null;
  $scope.worldPart = coreConfig.getRegion();

  $scope.bigModalDialog = false;

  $scope.newDisplayName = {
    value: '',
  };

  $scope.autoRenew = null;
  $scope.autoRenewStopBother = true;
  $scope.autoRenewable = false;
  $scope.autoRenewGuide = null;
  $scope.hasPaymentMean = false;

  $scope.housingPhoneStopBother = true;
  $scope.housingPhoneNumber = constants.urls.FR.housingPhoneSupport;
  $scope.isHousing = false;

  $scope.setToBigModalDialog = (active) => {
    $scope.mediumModalDialog = false;
    $scope.bigModalDialog = active;
  };

  $scope.resetAction = () => {
    $scope.setAction(false);
    $scope.setToBigModalDialog(false);
  };

  $scope.$on('$locationChangeStart', () => {
    $scope.resetAction();
  });

  $scope.setMessage = (message, data) => {
    let messageToSend = message;
    let i = 0;
    $scope.alertType = '';
    if (data) {
      if (data.message) {
        messageToSend += ` (${data.message})`;
        switch (data.type) {
          case 'ERROR':
            $scope.alertType = 'alert-danger';
            break;
          case 'WARNING':
            $scope.alertType = 'alert-warning';
            break;
          case 'INFO':
            $scope.alertType = 'alert-success';
            break;
          default:
            break;
        }
      } else if (data.messages) {
        if (data.messages.length > 0) {
          switch (data.state) {
            case 'ERROR':
              $scope.alertType = 'alert-danger';
              break;
            case 'PARTIAL':
              $scope.alertType = 'alert-warning';
              break;
            case 'OK':
              $scope.alertType = 'alert-success';
              break;
            default:
              break;
          }
          messageToSend += ' (';
          for (i; i < data.messages.length; i += 1) {
            messageToSend += `${data.messages[i].id} : ${data.messages[i].message}${data.messages.length === i + 1 ? ')' : ', '}`;
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
            $scope.alertType = 'alert-danger';
            break;
          case 'WAITING_ACK':
          case 'waitingAck':
          case 'DOING':
          case 'doing':
            $scope.alertType = 'alert-warning';
            break;
          case 'TODO':
          case 'todo':
          case 'DONE':
          case 'done':
            $scope.alertType = 'alert-success';
            break;
          default:
            break;
        }
      } else if (data === 'true' || data === true) {
        $scope.alertType = 'alert-success';
      } else if (data.type) {
        switch (data.type) {
          case 'ERROR':
            $scope.alertType = 'alert-danger';
            break;
          case 'WARNING':
            $scope.alertType = 'alert-warning';
            break;
          case 'INFO':
            $scope.alertType = 'alert-success';
            break;
          default:
            break;
        }
      }
    } else if (data === 'false' || data === false) {
      $scope.alertType = 'alert-danger';
    }
    $scope.message = messageToSend;
  };

  $scope.setAction = (action, data) => {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      $scope.stepPath = `dedicated/server/${$scope.currentAction}.html`;

      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };

  $scope.$on('dedicated.informations.reload', () => {
    loadServer();
  });

  function load() {
    User.getUrlOf('changeOwner').then((link) => {
      $scope.changeOwnerUrl = link;
    });

    $scope.loaders.autoRenew = true;

    $q
      .all({
        user: User.getUser(),
        paymentIds: coreConfig.getRegion() !== 'US' ? User.getValidPaymentMeansIds() : $q.when([]),
      })
      .then((data) => {
        $scope.user = data.user;
        $scope.hasPaymentMean = data.paymentIds.length > 0;
        $scope.hasAutoRenew();
        checkIfStopBotherHousingPhone();
      })
      .finally(() => {
        $scope.loaders.autoRenew = false;
      });

    loadServer()
      .then(() => loadMonitoring())
      .then(() => getTaskInProgress())
      .finally(() => {
        if ($scope.server.canTakeRendezVous) {
          $state.go('app.dedicated.server.rendezvous');
        }
      });
  }

  function loadServer() {
    if (!$scope.disable.noDeleteMessage) {
      $scope.message = null;
    } else {
      $scope.disable.noDeleteMessage = false;
    }

    Server.getUrlRenew($stateParams.productId).then((url) => {
      $scope.urlRenew = url;
    });

    Server.getUsbStorageInformations($stateParams.productId).then(
      (result) => {
        if (isArray(result) && result[1].usbKeys) {
          $scope.disable.usbStorageTab = true;
        }
      },
    );

    return $q
      .allSettled([
        Server.getServiceInfos($stateParams.productId),
        Server.getVrackInfos($stateParams.productId),
      ])
      .then((data) => {
        const [serviceInfos, vrackInfos] = data;

        const expiration = moment.utc($scope.server.expiration);
        set($scope.server, 'expiration', moment([expiration.year(), expiration.month(), expiration.date()]).toDate());

        const creation = moment.utc(serviceInfos.creation);
        set($scope.server, 'creation', moment([creation.year(), creation.month(), creation.date()]).toDate());

        /* if there is no os installed, the api return "none_64" */
        if (/^none_\d{2}?$/.test(server.os)) {
          $scope.server.os = null;
        }

        $scope.infoServer = {
          dc: $scope.server.datacenter.replace('_', ' '),
          dcImage: $scope.server.datacenter.replace(/_.*/g, ''),
          rack: $scope.server.rack,
          serverId: $scope.server.serverId,
        };
        $scope.vrackInfos = vrackInfos;

        $scope.loadingServerInformations = false;
        $scope.isHousing = isHousing(server);
        $scope.serviceInfos = serviceInfos;

        $scope.tabOptions = {
          isFirewallEnabled: dedicatedServerFeatureAvailability
            .allowDedicatedServerFirewallCiscoAsa(),
          isIPMIDisabled: $scope.isHousing,
          isUSBStorageEnabled: dedicatedServerFeatureAvailability.allowDedicatedServerUSBKeys(),
        };

        $scope.$broadcast('dedicated.server.refreshTabs');

        if (isEligibleForUpgrade()) {
          Server.getUpgradeProductName(ELIGIBLE_FOR_UPGRADE.PLAN_NAME, $scope.user.ovhSubsidiary)
            .then((upgradeName) => {
              $scope.upgradeName = upgradeName;
            });
        }
      })
      .catch((data) => {
        $scope.loadingServerInformations = false;
        $scope.loadingServerError = true;
        set(data, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_dashboard_loading_error'), data);
      });
  }

  function loadMonitoring() {
    return $q
      .all([
        Server.getModels(),
        Server.getAllServiceMonitoring($stateParams.productId),
      ])
      .then(([models, allServiceMonitoring]) => {
        $scope.monitoringProtocolEnum = models.data.models['dedicated.server.MonitoringProtocolEnum'].enum;
        $scope.serviceMonitoring = allServiceMonitoring;
        $scope.servicesStateLinks = {
          weathermap: WEATHERMAP_URL,
          vms: constants.vmsUrl,
          travaux: constants.travauxUrl,
        };
      }, (err) => {
        set(err, 'data.type', 'ERROR');
        $scope.setMessage($translate.instant('server_dashboard_loading_error'), err.data);
      });
  }

  $scope.isMonitoringEnabled = (protocol) => $scope.serviceMonitoring
    .filter((monitoring) => monitoring.enabled && monitoring.protocol === protocol).length > 0;

  $scope.$on('server.monitoring.reload', loadMonitoring);

  // ---------- TASKS + Polling-------------

  $scope.$on('$destroy', () => {
    Polling.addKilledScope();
  });

  function getTaskInProgress() {
    return $q.all({
      hardRebootTasks: Server.getTaskInProgress($stateParams.productId, 'hardReboot'),
      resetIPMITasks: Server.getTaskInProgress($stateParams.productId, 'resetIPMI'),
      reinstallServerTasks: Server.getTaskInProgress($stateParams.productId, 'reinstallServer'),
    }).then(({ hardRebootTasks, resetIPMITasks, reinstallServerTasks }) => {
      if (isArray(hardRebootTasks) && !isEmpty(hardRebootTasks)) {
        $scope.$broadcast('dedicated.informations.reboot', hardRebootTasks[0]);
      }

      // Do not call broadcast dedicated.ipmi.resetinterfaces
      if (isArray(resetIPMITasks) && !isEmpty(resetIPMITasks)) {
        initIpmiRestart(resetIPMITasks[0]);
      }

      if (isArray(reinstallServerTasks) && !isEmpty(reinstallServerTasks)) {
        $scope.$broadcast('dedicated.informations.reinstall', reinstallServerTasks[0]);
      } else if (!has(reinstallServerTasks, 'messages')) {
        checkInstallationProgress();
      } else {
        $scope.$broadcast('dedicated.server.refreshTabs');
      }
    });
  }

  // Server Restart
  $scope.$on('dedicated.informations.reboot', (e, _task) => {
    let task = _task;
    $scope.disable.reboot = true;
    task = task.data;
    task.id = task.taskId;
    startPollRestart(task);
  });

  function startPollRestart(task) {
    Server.addTask($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          $scope.disable.reboot = false;
          $scope.$broadcast('dedicated.informations.reboot.done');
          $scope.setMessage($translate.instant('server_configuration_reboot_successfull', { t0: $scope.server.name }), true);
        } else {
          startPollRestart(task);
        }
      },
      (data) => {
        $scope.disable.reboot = false;
        $scope.$broadcast('dedicated.informations.reboot.done');
        set(data, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_configuration_reboot_fail_task'), data);
      },
    );
  }

  // Server Install
  $scope.$on('dedicated.informations.reinstall', (e, task) => {
    if (!$scope.disable.install) {
      $scope.disable.install = true;
      checkInstallationProgress(task);
    }
  });

  function checkInstallationProgress(task) {
    Server.progressInstallation($stateParams.productId).then(
      (installationStep) => {
        $scope.disable.installationInProgress = true;
        $scope.disable.installationInProgressError = false;
        angular.forEach(installationStep.progress, (value) => {
          if (includes(errorStatus, value.status.toString().toLowerCase())) {
            $scope.disable.installationInProgressError = true;
            $scope.disable.install = false;
          }
        });

        if (!$scope.disable.installationInProgressError && task) {
          startPollReinstall(task);
        }
      },
    ).catch((err) => {
      if (err.status === 404) {
        if ($scope.disable.installationInProgress) {
          $scope.disable.noDeleteMessage = true;
          $scope.setMessage($translate.instant('server_configuration_installation_progress_end'), true);
          $scope.$broadcast('dedicated.informations.reload');
        }

        $scope.disable.install = false;
        $scope.disable.installationInProgress = false;
        $scope.disable.installationInProgressError = false;
        $scope.loadingServerInformations = false;
        $scope.$broadcast('dedicated.server.refreshTabs');
        return;
      }

      if (task) {
        startPollReinstall(task);
      } else {
        $scope.setMessage($translate.instant('server_configuration_installation_fail_task', { t0: $scope.server.name }), false);
      }
    });
  }

  function startPollReinstall(task) {
    Server.addTask($stateParams.productId, task, $scope.$id)
      .then((state) => {
        if (Polling.isResolve(state)) {
          if (Polling.isDone(state)) {
            checkInstallationProgress();
          }
        } else {
          checkInstallationProgress(task);
        }
      })
      .catch((data) => {
        $scope.disable.install = false;
        set(data, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_configuration_installation_fail_task', { t0: $scope.server.name }), data);
      });
  }

  // Auto renew
  $scope.hasAutoRenew = () => {
    $scope.autoRenew = false;
    if (NO_AUTORENEW_COUNTRIES.indexOf($scope.user.ovhSubsidiary) === -1) {
      return $q
        .all({
          serverServiceInfo: Server.getServiceInfos($stateParams.productId),
          isAutoRenewable: Server.isAutoRenewable($stateParams.productId),
        })
        .then((results) => {
          $scope.autoRenew = results.serverServiceInfo.renew
            && results.serverServiceInfo.renew.automatic;
          $scope.autoRenewable = results.isAutoRenewable;
          $scope.autoRenewGuide = constants.urls[$scope.user.ovhSubsidiary].guides.autoRenew
            || constants.urls.FR.guides.autoRenew;
          $scope.checkIfStopBotherAutoRenew();
        });
    }
    return $q.when(true);
  };

  $scope.stopBotherAutoRenew = () => {
    $scope.autoRenewStopBother = true;
    let serverArrayToStopBother = [];

    ovhUserPref
      .getValue('SERVER_AUTORENEW_STOP_BOTHER')
      .then((data) => {
        serverArrayToStopBother = data;
        return Server.getSelected($stateParams.productId);
      })
      .then((dedicatedServer) => {
        serverArrayToStopBother.push(dedicatedServer.name);
        return ovhUserPref.assign('SERVER_AUTORENEW_STOP_BOTHER', serverArrayToStopBother);
      })
      .catch((error) => (error.status === 404 ? $scope.createStopBotherAutoRenewUserPref() : $scope.setMessage($translate.instant('server_autorenew_stop_bother_error'), error.data)));
  };

  $scope.createStopBotherAutoRenewUserPref = () => {
    ovhUserPref.create('SERVER_AUTORENEW_STOP_BOTHER', [$scope.server.name]);
  };

  $scope.checkIfStopBotherAutoRenew = () => ovhUserPref
    .getValue('SERVER_AUTORENEW_STOP_BOTHER')
    .then((serverToStopBother) => {
      $scope.autoRenewStopBother = indexOf(serverToStopBother, $scope.server.name) !== -1;
    })
    .catch(error => (error.status === 404 ? ($scope.autoRenewStopBother = false) : $q.reject(error))); // eslint-disable-line

  // IPMI Restart (other task by tab)
  $scope.$on('dedicated.ipmi.resetinterfaces', (e, task) => {
    initIpmiRestart(task);
  });

  function initIpmiRestart(task) {
    $scope.disable.byOtherTask = true;
    startIpmiPollRestart(task);
  }

  function startIpmiPollRestart(task) {
    $scope.disable.byOtherTask = true;
    Server.addTaskFast($stateParams.productId, task, $scope.$id)
      .then((state) => {
        if (Polling.isResolve(state)) {
          $scope.disable.byOtherTask = false;
        } else {
          startIpmiPollRestart(task);
        }
      })
      .catch(() => {
        $scope.disable.byOtherTask = false;
      });
  }

  $scope.createStopBotherUserPref = () => {
    ovhUserPref.create('HOUSING_SUPPORT_PHONE_STOP_BOTHER', true);
  };

  function checkIfStopBotherHousingPhone() {
    return ovhUserPref
      .getValue('HOUSING_SUPPORT_PHONE_STOP_BOTHER')
      .then((stopBother) => {
        $scope.housingPhoneStopBother = stopBother;
      })
      .catch(() => {
        $scope.housingPhoneStopBother = false;
      });
  }

  function isHousing(dedicatedServer) {
    return dedicatedServer.commercialRange === 'housing';
  }

  load();

  $scope.isEligibleForUpgrade = () => isEligibleForUpgrade();
  $scope.URLS = URLS;

  function isEligibleForUpgrade() {
    return includes(ELIGIBLE_FOR_UPGRADE.SUBSIDIARIES, $scope.user.ovhSubsidiary);
  }
});
/* eslint-enable no-use-before-define */
