angular.module('App').controller('ImpiCtrl', (
  $sce,
  $scope,
  $stateParams,
  $translate,
  Alerter,
  coreConfig,
  dedicatedServerFeatureAvailability,
  Polling,
  Server,
  User,
) => {
  $scope.ttl = '5';
  $scope.alert = 'server_tab_ipmi_alert';

  $scope.ipmi = {
    server: null,
    model: null,
    navigatorUrl: null,
  };

  $scope.kvm = {
    canOrderKvm: false,
    features: null,
  };

  $scope.loader = {
    loading: false,
    error: false,
    httpLoading: false,
    httpError: false,
    httpDone: false,
    passwordLoading: false,
    passwordError: false,
    passwordDone: false,
    pingLoading: false,
    pingError: false,
    pingDone: false,

    buttonStart: false,
    navigationLoading: false,
    navigationReady: null,
    javaLoading: false,
    javaReady: false,
    sshLoading: false,
    kvmhtmlLoading: false,
    solSshKeyLoading: false,
    kvm: false,
  };

  $scope.disable = {
    restartIpmi: false,
    restartSession: false,
    testActive: false,
    testIpmi: false,
    otherTask: true,
    localTask: false,
  };

  $scope.header = {
    XSRFTOKEN: $.cookie('XSRF-TOKEN'),
    XCsid: $.getUrlParam('csid'),
  };

  $scope.ssh = {
    list: [],
    error: false,
    selectedKey: '',
  };

  // Icons Status change
  function setHttpState(load, done, error) {
    $scope.loader.httpLoading = load;
    $scope.loader.httpDone = done;
    $scope.loader.httpError = error;
  }
  function setPasswordState(load, done, error) {
    $scope.loader.passwordLoading = load;
    $scope.loader.passwordDone = done;
    $scope.loader.passwordError = error;
  }
  function setPingState(load, done, error) {
    $scope.loader.pingLoading = load;
    $scope.loader.pingDone = done;
    $scope.loader.pingError = error;
  }

  // ------------Loader------------
  $scope.init = function () {
    User.getUrlOf('dedicatedIpmi').then((link) => {
      $scope.ipmiHelpUrl = link;
    });

    User.getUser().then((user) => {
      $scope.user = user;
    });

    Server.getSelected($stateParams.productId).then((server) => {
      $scope.ipmi.server = server;
      const urlkvm = `api/dedicated/server/${$scope.ipmi.server.name}/ipmi/connections/kvmipJnlp`;
      $scope.ipmi.server.urlkvm = $sce.trustAsResourceUrl(urlkvm);
    });

    isActivated().then(() => {
      if (_.has($scope.ipmi.model, 'supportedFeatures.serialOverLanSshKey')) {
        loadSshKey();
      }

      if (!$scope.ipmi.model.activated) {
        Server.canOrderKvm($stateParams.productId).then((orderable) => {
          $scope.kvm.canOrderKvm = orderable === 'true' || orderable === true;

          if (!$scope.kvm.canOrderKvm) {
            $scope.loader.loading = true;
            Server.getKvmFeatures($stateParams.productId)
              .then(
                (features) => {
                  $scope.kvm.features = features;
                },
                ({ data }) => {
                  Alerter.alertFromSWS($translate.instant('server_configuration_kvm_error'), data, $scope.alert);
                },
              )
              .finally(() => {
                $scope.loader.loading = false;
              });
          }
        });
      }
    });
    getTaskInProgress();
  };

  $scope.$on('$destroy', () => {
    Polling.addKilledScope($scope.$id);
  });

  $scope.$on('dedicated.informations.reboot.done', () => {
    $scope.disable.otherTask = false;
  });

  $scope.$on('dedicated.informations.reboot', () => {
    $scope.disable.otherTask = true;
    $scope.loader.navigationReady = null;
    $scope.loader.javaReady = false;
  });

  function isActivated() {
    $scope.loader.loading = true;
    $scope.loader.error = false;
    return Server.isIpmiActivated($stateParams.productId).then((results) => {
      $scope.ipmi.model = results;
      $scope.loader.loading = false;
    }).catch((data) => {
      $scope.loader.loading = false;
      $scope.loader.error = true;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
    });
  }

  function getTaskInProgress() {
    // Test if serveur reboot is in progress
    Server.getTaskInProgress($stateParams.productId, 'hardReboot').then((taskTab) => {
      if (taskTab.length === 0) {
        // Test if ipmi session reboot is in progress
        Server.getTaskInProgress($stateParams.productId, 'resetIPMISession').then((_taskTab) => {
          if (_taskTab.length > 0) {
            $scope.disable.localTask = true;
            $scope.disable.restartSession = true;
            startIpmiPollSessionsReset(_taskTab[0]);
          }
        });

        // Test if ipmi restart reboot is in progress
        Server.getTaskInProgress($stateParams.productId, 'resetIPMI').then((_taskTab) => {
          if (_taskTab.length > 0) {
            $scope.disable.localTask = true;
            $scope.disable.restartIpmi = true;
            startIpmiPollRestart(_taskTab[0]);
          }
        });

        // Test if ipmi test is in progress
        Server.getTaskInProgress($stateParams.productId, 'testIPMIhttp').then((_taskTab) => {
          if (_taskTab.length > 0) {
            startIpmiPollHttp(_taskTab[0]);
          } else {
            Server.getTaskInProgress($stateParams.productId, 'testIPMIpassword').then((__taskTab) => {
              if (__taskTab.length > 0) {
                startIpmiPollPassword(__taskTab[0]);
              } else {
                Server.getTaskInProgress($stateParams.productId, 'testIPMIping').then((___taskTab) => {
                  if (___taskTab.length > 0) {
                    startIpmiPollPing(___taskTab[0]);
                  }
                });
              }
            });
          }
        });
        $scope.disable.otherTask = false;
      }
    });
  }

  // ------------Start IPMI------------
  // NAVIGATION
  $scope.startIpmiNavigation = function () {
    $scope.loader.navigationLoading = true;
    $scope.loader.buttonStart = true;
    $scope.loader.navigationReady = null;

    return Server.ipmiStartConnection({
      serviceName: $stateParams.productId,
      type: 'serialOverLanURL',
      ttl: $scope.ttl,
      ipToAllow: $scope.ipmi.model.clientIp,
    }).then(({ taskId }) => {
      return startIpmiPollNavigation({ id: taskId });
    }).catch(({ data }) => {
      $scope.loader.navigationLoading = false;
      $scope.loader.buttonStart = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
    });
  };

  function startIpmiPollNavigation(task) {
    return Server.addTaskFast($stateParams.productId, task, $scope.$id).then((state) => {
      if (Polling.isResolve(state)) {
        return getIpmiNavigation();
      }
      return startIpmiPollNavigation(task);
    }).catch((data) => {
      $scope.loader.navigationLoading = false;
      $scope.loader.buttonStart = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
    });
  }

  function getIpmiNavigation() {
    return Server.ipmiGetConnection($stateParams.productId, 'serialOverLanURL').then((connect) => {
      $scope.loader.navigationReady = connect.value;
      window.open(connect.value, '_blank');
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_success'), true, $scope.alert);
    }).catch((data) => {
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
    }).finally(() => {
      $scope.loader.navigationLoading = false;
      $scope.loader.buttonStart = false;
    });
  }

  // ------------Start KVM URL------------
  $scope.getIpmiKvmUrl = function () {
    $scope.loader.buttonStart = true;
    $scope.loader.kvmhtmlLoading = true;
    return Server.ipmiStartConnection({
      serviceName: $stateParams.productId,
      type: 'kvmipHtml5URL',
      ttl: $scope.ttl,
      ipToAllow: $scope.ipmi.model.clientIp,
    }).then(({ taskId }) => {
      startIpmiKvmUrlPoll({ id: taskId });
    }).catch((data) => {
      $scope.loader.kvmhtmlLoading = false;
      $scope.loader.buttonStart = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
    });
  };

  function startIpmiKvmUrlPoll(task) {
    return Server.addTaskFast($stateParams.productId, task, $scope.$id)
      .then((state) => {
        if (Polling.isResolve(state)) {
          return getKvmUrl();
        }
        return startIpmiKvmUrlPoll(task);
      })
      .catch((data) => {
        $scope.loader.kvmhtmlLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
      });
  }

  function getKvmUrl() {
    return Server.ipmiGetConnection($stateParams.productId, 'kvmipHtml5URL')
      .then((kvmUrl) => {
        $scope.loader.kvmUrlReady = true;
        $scope.loader.kvmUrl = kvmUrl.value;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_success'), true, $scope.alert);
      })
      .catch((data) => {
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
      }).finally(() => {
        $scope.loader.kvmhtmlLoading = false;
        $scope.loader.buttonStart = false;
      });
  }

  // JAVA
  $scope.startIpmiJava = function () {
    $scope.loader.javaReady = false;
    $scope.loader.javaLoading = true;
    $scope.loader.buttonStart = true;
    const withGeolocation = !_.includes(['HIL_1', 'VIN_1'], $scope.server.datacenter) && coreConfig.getRegion() === 'US';
    return Server.ipmiStartConnection({
      serviceName: $stateParams.productId,
      type: 'kvmipJnlp',
      ttl: $scope.ttl,
      ipToAllow: $scope.ipmi.model.clientIp,
      withGeolocation,
    }).then(({ taskId }) => {
      startIpmiPollJava({ id: taskId });
    }).catch((data) => {
      $scope.loader.javaLoading = false;
      $scope.loader.buttonStart = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_error'), data, $scope.alert);
    });
  };

  function startIpmiPollJava(task) {
    return Server.addTaskFast($stateParams.productId, task, $scope.$id)
      .then((state) => {
        if (Polling.isResolve(state)) {
          return getIpmiJava();
        }
        return startIpmiPollJava(task);
      })
      .catch((data) => {
        $scope.loader.javaLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_error'), data, $scope.alert);
      });
  }

  function getIpmiJava() {
    Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_success'), true, $scope.alert);
    $scope.loader.javaLoading = false;
    $scope.loader.buttonStart = false;
    $scope.loader.javaReady = true;

    return Server.ipmiGetConnection($stateParams.productId, 'kvmipJnlp')
      .then((data) => {
        const fileName = `${$stateParams.productId.replace(/\./g, '-')}|.jnlp`;
        const blob = new Blob([data.value], { type: 'application/x-java-jnlp-file' });

        let link;
        let url;

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          link = document.createElement('a');
          if (link.download !== undefined) {
            url = window.URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // window.open("data:application/x-java-jnlp-file," + encodeURIComponent(data.value));
            $scope.appletToDownload = encodeURIComponent(data.value);
          }
        }
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_java_error'), err, $scope.alert);
      });
  }

  $scope.downloadApplet = function () {
    window.open(`data:application/x-java-jnlp-file,${$scope.appletToDownload}`);
  };

  $scope.submitForm = function () {
    $('#formIpmiJava').submit();
  };

  // ------------Test IPMI------------
  $scope.startIpmiTest = function () {
    setHttpState(false, false, false);
    setPasswordState(false, false, false);
    setPingState(false, false, false);
    startIpmiTestHttp();
  };

  function startIpmiTestStatus() {
    $scope.disable.testActive = true;
    $scope.disable.testIpmi = true;
  }

  // HTTP
  function startIpmiTestHttp() {
    startIpmiTestStatus();
    setHttpState(true, false, false);

    return Server.ipmiStartTest($stateParams.productId, 'http', $scope.ttl).then((task) => {
      return startIpmiPollHttp(task);
    }).catch((data) => {
      setHttpState(false, false, false);
      $scope.disable.testIpmi = true;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
    });
  }

  function startIpmiPollHttp(task) {
    startIpmiTestStatus();
    setHttpState(true, false, false);

    return Server.addTaskFast($stateParams.productId, task, $scope.$id).then((state) => {
      if (Polling.isResolve(state)) {
        setHttpState(false, true, false);
        return startIpmiTestPassword();
      }
      return startIpmiPollHttp(task);
    }).catch(() => {
      $scope.disable.testIpmi = false;
      setHttpState(false, false, true);
    });
  }

  // PASSWORD
  function startIpmiTestPassword() {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(true, false, false);

    return Server.ipmiStartTest($stateParams.productId, 'password', $scope.ttl).then((task) => {
      return startIpmiPollPassword(task);
    }).catch((data) => {
      $scope.disable.testIpmi = false;
      setPasswordState(false, false, false);
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
    });
  }

  function startIpmiPollPassword(task) {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(true, false, false);

    return Server.addTaskFast($stateParams.productId, task, $scope.$id).then((state) => {
      if (Polling.isResolve(state)) {
        setPasswordState(false, true, false);
        return startIpmiTestPing();
      }
      return startIpmiPollPassword(task);
    }).catch(() => {
      $scope.disable.testIpmi = false;
      setPasswordState(false, false, true);
    });
  }

  // PING
  function startIpmiTestPing() {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(false, true, false);
    setPingState(true, false, false);

    return Server.ipmiStartTest($stateParams.productId, 'ping', $scope.ttl).then((task) => {
      return startIpmiPollPing(task);
    }).catch((data) => {
      $scope.disable.testIpmi = false;
      setPingState(false, false, false);
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_loading_error'), data, $scope.alert);
    });
  }

  function startIpmiPollPing(task) {
    startIpmiTestStatus();
    setHttpState(false, true, false);
    setPasswordState(false, true, false);
    setPingState(true, false, false);

    return Server.addTaskFast($stateParams.productId, task, $scope.$id).then((state) => {
      if (Polling.isResolve(state)) {
        $scope.disable.testIpmi = false;
        return setPingState(false, true, false);
      }
      return startIpmiPollPing(task);
    }).catch(() => {
      $scope.disable.testIpmi = false;
      setPingState(false, false, true);
    });
  }

  // ---------ACTION SSH SOL------------
  $scope.onSelectSshKey = function () {
    $scope.loader.buttonStart = true;
    $scope.loader.solSshKeyLoading = true;
    return Server.ipmiStartConnection({
      serviceName: $stateParams.productId,
      type: 'serialOverLanSshKey',
      ttl: $scope.ttl,
      sshKey: $scope.ssh.selectedKey,
      ipToAllow: $scope.ipmi.model.clientIp,
    }).then(({ taskId }) => {
      startSolSshPolling({ id: taskId });
    }).catch((data) => {
      $scope.loader.solSshKeyLoading = false;
      $scope.loader.buttonStart = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
    });
  };

  function startSolSshPolling(task) {
    return Server.addTaskFast($stateParams.productId, task, $scope.$id)
      .then((state) => {
        if (Polling.isResolve(state)) {
          return getSolSsh();
        }
        return startSolSshPolling(task);
      }).catch((data) => {
        $scope.loader.solSshKeyLoading = false;
        $scope.loader.buttonStart = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
      });
  }

  function getSolSsh() {
    return Server.ipmiGetConnection($stateParams.productId, 'serialOverLanSshKey')
      .then((solSsh) => {
        $scope.ssh.solSshUrl = solSsh.value;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_success'), true, $scope.alert);
      })
      .catch((data) => {
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_navigation_error'), data, $scope.alert);
      }).finally(() => {
        $scope.loader.solSshKeyLoading = false;
        $scope.loader.buttonStart = false;
      });
  }
  // ------------ACTION IPMI------------
  // Interfaces Restart
  $scope.$on('dedicated.ipmi.resetinterfaces', (e, task) => {
    $scope.disable.restartIpmi = true;
    $scope.disable.localTask = true;
    startIpmiPollRestart(task.data || task);
  });

  function startIpmiPollRestart(task) {
    $scope.loader.navigationReady = null;
    $scope.loader.javaReady = false;
    return Server.addTaskFast($stateParams.productId, task, $scope.$id).then((state) => {
      if (Polling.isResolve(state)) {
        $scope.disable.restartIpmi = false;
        $scope.disable.localTask = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_restart_success'), true, $scope.alert);
      } else {
        startIpmiPollRestart(task);
      }
    }).catch((data) => {
      $scope.disable.restartIpmi = false;
      $scope.disable.localTask = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_restart_error_task'), data, $scope.alert);
    });
  }

  // Sessions Reset
  $scope.$on('dedicated.ipmi.resetsessions', (e, task) => {
    $scope.disable.restartSession = true;
    $scope.disable.localTask = true;
    startIpmiPollSessionsReset(task.data || task);
  });

  function startIpmiPollSessionsReset(task) {
    $scope.loader.navigationReady = null;
    $scope.loader.javaReady = false;
    return Server.addTaskFast($stateParams.productId, task, $scope.$id).then((state) => {
      if (Polling.isResolve(state)) {
        $scope.disable.restartSession = false;
        $scope.disable.localTask = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_impi_sessions_success'), true, $scope.alert);
      } else {
        startIpmiPollSessionsReset(task);
      }
    }).catch((data) => {
      $scope.disable.restartSession = false;
      $scope.disable.localTask = false;
      Alerter.alertFromSWS($translate.instant('server_configuration_impi_restart_error_task_session'), data, $scope.alert);
    });
  }

  function loadSshKey() {
    return Server.getSshKey($stateParams.productId).then((data) => {
      $scope.ssh.error = false;
      $scope.ssh.list = data;
    }).catch(() => {
      $scope.ssh.error = true;
    });
  }

  $scope.hasSOL = () => dedicatedServerFeatureAvailability.hasSerialOverLan();
});
