import isFunction from 'lodash/isFunction';
import includes from 'lodash/includes';
import set from 'lodash/set';

import Ipmi from './ipmi.class';
import Kvm from './kvm.class';
import { State, STATE_ENUM } from './state.class';

import { getIpmiGuideUrl, SSH_KEY } from './constants';

export default class BmServerComponentsIpmiController {
  /* @ngInject */
  constructor(
    $sce,
    $translate,
    $window,
    atInternet,
    coreConfig,
    IpmiService,
    Polling,
    $scope,
    $timeout,
    $q,
  ) {
    this.$sce = $sce;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.IpmiService = IpmiService;
    this.Polling = Polling;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$q = $q;
  }

  $onInit() {
    this.ttl = '5';
    this.serviceName = this.server.name;
    this.ipmi = null;
    this.kvm = null;
    this.canOrderKvm = false;

    this.httpState = new State();
    this.passwordState = new State();
    this.pingState = new State();
    this.javaState = new State();

    this.loader = {
      loading: false,
      error: false,
      buttonStart: false,
      navigationLoading: false,
      navigationReady: null,
      sshLoading: false,
      kvmhtmlLoading: false,
      solSshKeyLoading: false,
      kvm: false,
    };

    this.disable = {
      restartIpmi: false,
      restartSession: false,
      testActive: false,
      testIpmi: false,
      otherTask: false,
      localTask: false,
    };

    this.ssh = {
      publicKey: '',
      inputRules: SSH_KEY,
    };

    this.ipmiHelpUrl = getIpmiGuideUrl(this.user.ovhSubsidiary);

    this.loader.loading = true;
    this.loader.error = false;
    this.$q
      .all({
        ipmiFeatures: this.loadIpmiFeatures().then(() => {
          // load kvm features if IPMI is not activated
          if (!this.ipmi.isActivated()) {
            return this.IpmiService.getKvmFeatures(this.serviceName)
              .catch(() => ({}))
              .then((kvmFeatures) => {
                const canOrderKvm = !Object.keys(kvmFeatures).length;
                this.kvm = new Kvm(kvmFeatures, canOrderKvm);
              });
          }
          return true;
        }),
        taskInProgress: this.getTaskInProgress(),
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_loading_error'),
        );
        this.loader.error = true;
      })
      .finally(() => {
        this.loader.loading = false;
      });

    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (this.$scope.currentAction) {
        this.$scope.stepPath = `bm-server-components/ipmi/${action}.html`;

        $('#sshAction').modal({
          keyboard: false,
          backdrop: 'static',
        });
      } else {
        $('#sshAction').modal('hide');

        this.$timeout(() => {
          delete this.$scope.stepPath;
        }, 300);
      }
    };

    this.$scope.resetAction = () => {
      this.$scope.setAction();
    };
  }

  $onDestroy() {
    this.Polling.addKilledScope(this.$scope.$id);
  }

  loadIpmiFeatures() {
    return this.IpmiService.getIpmiFeatures(this.serviceName).then(
      (ipmiFeatures) => {
        const urlkvm = `api/dedicated/server/${this.serviceName}/ipmi/connections/kvmipJnlp`;
        this.ipmi = new Ipmi(
          this.server,
          ipmiFeatures,
          this.$sce.trustAsResourceUrl(urlkvm),
        );
        return this.ipmi;
      },
    );
  }

  getIpmiNavigation() {
    return this.IpmiService.ipmiGetConnection(
      this.serviceName,
      'serialOverLanURL',
    )
      .then((connect) => {
        this.loader.navigationReady = connect.value;
        this.$window.open(connect.value, '_blank', 'noopener');
        this.handleSuccess(
          this.$translate.instant(
            'server_configuration_impi_navigation_success',
          ),
        );
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      })
      .finally(() => {
        this.loader.navigationLoading = false;
        this.loader.buttonStart = false;
      });
  }

  startIpmiTestStatus() {
    this.disable.testActive = true;
    this.disable.testIpmi = true;
  }

  startIpmiPollPing(task) {
    this.startIpmiTestStatus();
    this.setHttpState(STATE_ENUM.DONE);
    this.setPasswordState(STATE_ENUM.DONE);
    this.setPingState(STATE_ENUM.LOADING);

    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.disable.testIpmi = false;
          return this.setPingState(STATE_ENUM.DONE);
        }
        return this.startIpmiPollPing(task);
      })
      .catch(() => {
        this.disable.testIpmi = false;
        this.setPingState(STATE_ENUM.ERROR);
      });
  }

  // PING
  startIpmiTestPing() {
    this.startIpmiTestStatus();
    this.setHttpState(STATE_ENUM.DONE);
    this.setPasswordState(STATE_ENUM.DONE);
    this.setPingState(STATE_ENUM.LOADING);

    return this.IpmiService.ipmiStartTest(this.serviceName, 'ping', this.ttl)
      .then((task) => this.startIpmiPollPing(task))
      .catch((error) => {
        this.disable.testIpmi = false;
        this.setPingState(STATE_ENUM.NONE);
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_loading_error'),
        );
      });
  }

  startIpmiPollPassword(task) {
    this.startIpmiTestStatus();
    this.setHttpState(STATE_ENUM.DONE);
    this.setPasswordState(STATE_ENUM.LOADING);

    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.setPasswordState(STATE_ENUM.DONE);
          return this.startIpmiTestPing();
        }
        return this.startIpmiPollPassword(task);
      })
      .catch(() => {
        this.disable.testIpmi = false;
        this.setPasswordState(STATE_ENUM.ERROR);
      });
  }

  startIpmiTestPassword() {
    this.startIpmiTestStatus();
    this.setHttpState(STATE_ENUM.DONE);
    this.setPasswordState(STATE_ENUM.LOADING);

    return this.IpmiService.ipmiStartTest(
      this.serviceName,
      'password',
      this.ttl,
    )
      .then((task) => this.startIpmiPollPassword(task))
      .catch((error) => {
        this.disable.testIpmi = false;
        this.setPasswordState(STATE_ENUM.NONE);
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_loading_error'),
        );
      });
  }

  startIpmiPollHttp(task) {
    this.startIpmiTestStatus();
    this.setHttpState(STATE_ENUM.LOADING);

    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.setHttpState(STATE_ENUM.DONE);
          return this.startIpmiTestPassword();
        }
        return this.startIpmiPollHttp(task);
      })
      .catch(() => {
        this.disable.testIpmi = false;
        this.setHttpState(STATE_ENUM.ERROR);
      });
  }

  startIpmiTestHttp() {
    this.startIpmiTestStatus();
    this.setHttpState(STATE_ENUM.LOADING);

    return this.IpmiService.ipmiStartTest(this.serviceName, 'http', this.ttl)
      .then((task) => this.startIpmiPollHttp(task))
      .catch((error) => {
        this.setHttpState(STATE_ENUM.NONE);
        this.disable.testIpmi = true;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_loading_error'),
        );
      });
  }

  startIpmiPollSessionsReset(task) {
    this.loader.navigationReady = null;
    this.javaState.setState(STATE_ENUM.NONE);
    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.disable.restartSession = false;
          this.disable.localTask = false;
          this.handleSuccess(
            this.$translate.instant(
              'server_configuration_impi_sessions_success',
            ),
          );
        } else {
          this.startIpmiPollSessionsReset(task);
        }
      })
      .catch((error) => {
        this.disable.restartSession = false;
        this.disable.localTask = false;
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_impi_restart_error_task_session',
          ),
        );
      });
  }

  startIpmiPollRestart(task) {
    this.loader.navigationReady = null;
    this.javaState.setState(STATE_ENUM.NONE);
    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          this.disable.restartIpmi = false;
          this.disable.localTask = false;
          this.handleSuccess(
            this.$translate.instant(
              'server_configuration_impi_restart_success',
            ),
          );
        } else {
          this.startIpmiPollRestart(task);
        }
      })
      .catch((error) => {
        this.disable.restartIpmi = false;
        this.disable.localTask = false;
        this.handleError(
          error,
          this.$translate.instant(
            'server_configuration_impi_restart_error_task',
          ),
        );
      });
  }

  getTaskInProgress() {
    return this.IpmiService.getTaskInProgress(
      this.serviceName,
      'hardReboot',
    ).then((hardRebootTasks) => {
      if (hardRebootTasks.length === 0) {
        return this.$q.all({
          resetIPMISession: this.IpmiService.getTaskInProgress(
            this.serviceName,
            'resetIPMISession',
          ).then((tasks) => {
            if (tasks.length > 0) {
              this.disable.localTask = true;
              this.disable.restartSession = true;
              this.startIpmiPollSessionsReset(tasks[0]);
            }
            return true;
          }),
          resetIPMI: this.IpmiService.getTaskInProgress(
            this.serviceName,
            'resetIPMI',
          ).then((tasks) => {
            if (tasks.length > 0) {
              this.disable.localTask = true;
              this.disable.restartIpmi = true;
              this.startIpmiPollRestart(tasks[0]);
            }
            return true;
          }),
          testIPMIhttp: this.IpmiService.getTaskInProgress(
            this.serviceName,
            'testIPMIhttp',
          ).then((testIpmiHttpTasks) => {
            if (testIpmiHttpTasks.length > 0) {
              this.startIpmiPollHttp(testIpmiHttpTasks[0]);
            } else {
              return this.IpmiService.getTaskInProgress(
                this.serviceName,
                'testIPMIpassword',
              ).then((testIpmiPasswordTasks) => {
                if (testIpmiPasswordTasks.length > 0) {
                  this.startIpmiPollPassword(testIpmiPasswordTasks[0]);
                } else {
                  return this.IpmiService.getTaskInProgress(
                    this.serviceName,
                    'testIPMIping',
                  ).then((testIpmiPingTasks) => {
                    if (testIpmiPingTasks.length > 0) {
                      this.startIpmiPollPing(testIpmiPingTasks[0]);
                    }
                    return true;
                  });
                }
                return true;
              });
            }
            return true;
          }),
        });
      }
      this.disable.otherTask = true;
      return true;
    });
  }

  startIpmiPollNavigation(task) {
    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          return this.getIpmiNavigation();
        }
        return this.startIpmiPollNavigation(task);
      })
      .catch((error) => {
        this.loader.navigationLoading = false;
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  // ------------Start IPMI------------
  // NAVIGATION
  startIpmiNavigation() {
    this.trackClick('access-sol-browser');
    this.loader.navigationLoading = true;
    this.loader.buttonStart = true;
    this.loader.navigationReady = null;

    return this.IpmiService.ipmiStartConnection({
      serviceName: this.serviceName,
      type: 'serialOverLanURL',
      ttl: this.ttl,
      ipToAllow: this.ipmi.model.clientIp,
    })
      .then(({ taskId }) => this.startIpmiPollNavigation({ id: taskId }))
      .catch(({ error }) => {
        this.loader.navigationLoading = false;
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  getKvmUrl() {
    this.trackClick('access-sol-console');
    return this.IpmiService.ipmiGetConnection(this.serviceName, 'kvmipHtml5URL')
      .then((kvmUrl) => {
        this.loader.kvmUrlReady = true;
        this.loader.kvmUrl = kvmUrl.value;
        this.handleSuccess(
          this.$translate.instant(
            'server_configuration_impi_navigation_success',
          ),
        );
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      })
      .finally(() => {
        this.loader.kvmhtmlLoading = false;
        this.loader.buttonStart = false;
      });
  }

  startIpmiKvmUrlPoll(task) {
    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          return this.getKvmUrl();
        }
        return this.startIpmiKvmUrlPoll(task);
      })
      .catch((error) => {
        this.loader.kvmhtmlLoading = false;
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  // ------------Start KVM URL------------
  getIpmiKvmUrl() {
    this.trackClick('access-kvm-browser');
    this.loader.buttonStart = true;
    this.loader.kvmhtmlLoading = true;
    return this.IpmiService.ipmiStartConnection({
      serviceName: this.serviceName,
      type: 'kvmipHtml5URL',
      ttl: this.ttl,
      ipToAllow: this.ipmi.model.clientIp,
      withGeolocation: true,
    })
      .then(({ taskId }) => {
        this.startIpmiKvmUrlPoll({ id: taskId });
      })
      .catch((error) => {
        this.loader.kvmhtmlLoading = false;
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  getIpmiJava() {
    this.handleSuccess(
      this.$translate.instant('server_configuration_impi_java_success'),
    );
    this.loader.buttonStart = false;
    this.javaState.setState(STATE_ENUM.DONE);

    return this.IpmiService.ipmiGetConnection(this.serviceName, 'kvmipJnlp')
      .then((data) => {
        const fileName = `${this.serviceName.replace(/\./g, '-')}|.jnlp`;
        const blob = new Blob([data.value], {
          type: 'application/x-java-jnlp-file',
        });

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
            this.appletToDownload = encodeURIComponent(data.value);
          }
        }
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  startIpmiPollJava(task) {
    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          return this.getIpmiJava();
        }
        return this.startIpmiPollJava(task);
      })
      .catch((error) => {
        this.javaState.setState(STATE_ENUM.ERROR);
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_java_error'),
        );
      });
  }

  startIpmiJava() {
    this.javaState.setState(STATE_ENUM.LOADING);
    this.loader.buttonStart = true;
    const withGeolocation =
      !includes(['HIL_1', 'VIN_1'], this.server.datacenter) &&
      this.coreConfig.isRegion('US');
    return this.IpmiService.ipmiStartConnection({
      serviceName: this.serviceName,
      type: 'kvmipJnlp',
      ttl: this.ttl,
      ipToAllow: this.ipmi.model.clientIp,
      withGeolocation,
    })
      .then(({ taskId }) => {
        this.startIpmiPollJava({ id: taskId });
      })
      .catch((error) => {
        this.javaState.setState(STATE_ENUM.ERROR);
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_java_error'),
        );
      });
  }

  downloadApplet() {
    this.trackClick('access-kvm-java');
    this.$window.open(
      `data:application/x-java-jnlp-file,${this.appletToDownload}`,
    );
  }

  // ------------Test IPMI------------
  startIpmiTest() {
    this.trackClick('test-ipmi');
    this.setHttpState(STATE_ENUM.NONE);
    this.setPasswordState(STATE_ENUM.NONE);
    this.setPingState(STATE_ENUM.NONE);
    this.startIpmiTestHttp();
  }

  setHttpState(state) {
    this.httpState.setState(state);
  }

  setPasswordState(state) {
    this.passwordState.setState(state);
  }

  setPingState(state) {
    this.pingState.setState(state);
  }

  getSolSsh() {
    return this.IpmiService.ipmiGetConnection(
      this.serviceName,
      'serialOverLanSshKey',
    )
      .then((solSsh) => {
        this.ssh.solSshUrl = solSsh.value;
        this.handleSuccess(
          this.$translate.instant('server_configuration_impi_ssh_success'),
        );
      })
      .catch((error) => {
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_ssh_error'),
        );
      })
      .finally(() => {
        this.loader.solSshKeyLoading = false;
        this.loader.buttonStart = false;
      });
  }

  startSolSshPolling(task) {
    return this.addTaskFast(this.serviceName, task, this.$scope.$id)
      .then((state) => {
        if (this.Polling.isResolve(state)) {
          return this.getSolSsh();
        }
        return this.startSolSshPolling(task);
      })
      .catch((error) => {
        this.loader.solSshKeyLoading = false;
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  // ---------ACTION SSH SOL------------
  startSolSshSession() {
    this.trackClick('access-sol-ssh');
    this.loader.buttonStart = true;
    this.loader.solSshKeyLoading = true;
    this.$scope.setAction();
    return this.IpmiService.ipmiStartConnection({
      serviceName: this.serviceName,
      type: 'serialOverLanSshKey',
      ttl: this.ttl,
      sshKey: this.ssh.publicKey,
      ipToAllow: this.ipmi.model.clientIp,
    })
      .then(({ taskId }) => {
        this.startSolSshPolling({ id: taskId });
      })
      .catch((error) => {
        this.loader.solSshKeyLoading = false;
        this.loader.buttonStart = false;
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_navigation_error'),
        );
      });
  }

  isKeyValid() {
    return SSH_KEY.pattern.test(this.ssh.publicKey);
  }

  static getTaskPath(serviceName, taskId) {
    return `apiv6/dedicated/server/${serviceName}/task/${taskId}`;
  }

  addTaskFast(serviceName, task, scopeId) {
    set(task, 'id', task.id || task.taskId);
    const pollPromise = this.$q.defer();

    this.Polling.addTaskFast(
      BmServerComponentsIpmiController.getTaskPath(serviceName, task.id),
      task,
      scopeId,
    )
      .then((state) => {
        pollPromise.resolve(state);
      })
      .catch((data) => {
        pollPromise.reject(data);
      });
    return pollPromise.promise;
  }

  restartIpmi() {
    this.trackClick('reboot::confirm');
    this.loading = true;
    return this.IpmiService.ipmiRestart(this.serviceName)
      .then(({ taskId }) => {
        this.disable.restartIpmi = true;
        this.disable.localTask = true;
        this.startIpmiPollRestart({ id: taskId });
        this.handleSuccess(
          this.$translate.instant('server_configuration_impi_restart_loading'),
        );
      })
      .catch((error) =>
        this.handleError(
          error,
          this.$translate.instant('server_configuration_impi_restart_error'),
        ),
      )
      .finally(() => {
        this.showIpmiRestartConf = false;
        this.loading = false;
      });
  }

  isServerHacked() {
    return (
      this.server.state === 'HACKED' || this.server.state === 'HACKED_BLOCKED'
    );
  }

  handleError(error, message = null) {
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error },
      });
    }
  }

  handleSuccess(message) {
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message,
      });
    }
  }

  onShowIpmiRestartConf() {
    this.trackClick('reboot');
    this.showIpmiRestartConf = true;
  }

  onIpmiRestartCancel() {
    this.trackClick('reboot::cancel');
    this.showIpmiRestartConf = false;
  }

  orderKvm() {
    if (isFunction(this.onKvmOrder)) {
      this.trackClick('order-kvm');
      this.onKvmOrder();
    }
  }

  trackClick(trackText) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${trackText}`,
        type: 'action',
      });
    }
  }
}
