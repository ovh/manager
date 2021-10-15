import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import merge from 'lodash/merge';
import set from 'lodash/set';
import some from 'lodash/some';
import union from 'lodash/union';

export default class {
  /* @ngInject */
  constructor(
    $http,
    $scope,
    $rootScope,
    $location,
    $q,
    $state,
    $stateParams,
    $timeout,
    $translate,
    WucConverterService,
    Hosting,
    Alerter,
    Navigator,
    automatedEmailsLink,
    boostLink,
    constants,
    availableOptions,
    cdnProperties,
    cdnRange,
    coreURLBuilder,
    cronLink,
    currentActiveLink,
    databaseLink,
    emailOptionIds,
    emailOptionDetachInformation,
    envvarsLink,
    freedomLink,
    ftpLink,
    isEmailDomainAvailable,
    isLocalSeoAvailable,
    generalInformationLink,
    goToDetachEmail,
    goToDetachPrivateDB,
    goToEmails,
    WucUser,
    HostingDatabase,
    HostingDomain,
    HostingFreedom,
    HostingIndy,
    HostingOvhConfig,
    HostingTask,
    HostingCdnSharedService,
    HostingCdnOrderService,
    indyLink,
    localSEOLink,
    logs,
    moduleLink,
    multisiteLink,
    pendingTasks,
    PrivateDatabase,
    privateDatabasesDetachable,
    privateDatabasesIds,
    serviceName,
    runtimesLink,
    taskLink,
    user,
    userLogsLink,
    HOSTING_STATUS,
    OVH_ORDER_URLS,
  ) {
    this.$http = $http;
    this.$scope = $scope;
    this.$scope.cdnProperties = cdnProperties;
    this.$scope.cdnRange = cdnRange;
    this.$scope.HOSTING_STATUS = HOSTING_STATUS;
    this.$scope.logs = logs;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.WucConverterService = WucConverterService;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
    this.Navigator = Navigator;
    this.automatedEmailsLink = automatedEmailsLink;
    this.boostLink = boostLink;
    this.constants = constants;
    this.availableOptions = availableOptions;
    this.coreURLBuilder = coreURLBuilder;
    this.cronLink = cronLink;
    this.currentActiveLink = currentActiveLink;
    this.databaseLink = databaseLink;
    this.goToEmails = goToEmails;
    this.emailOptionIds = emailOptionIds;
    this.emailOptionDetachInformation = emailOptionDetachInformation;
    this.envvarsLink = envvarsLink;
    this.freedomLink = freedomLink;
    this.ftpLink = ftpLink;
    this.isEmailDomainAvailable = isEmailDomainAvailable;
    this.isLocalSeoAvailable = isLocalSeoAvailable;
    this.generalInformationLink = generalInformationLink;
    this.goToDetachEmail = goToDetachEmail;
    this.goToDetachPrivateDB = goToDetachPrivateDB;
    this.WucUser = WucUser;
    this.HostingDatabase = HostingDatabase;
    this.HostingDomain = HostingDomain;
    this.HostingFreedom = HostingFreedom;
    this.HostingIndy = HostingIndy;
    this.HostingOvhConfig = HostingOvhConfig;
    this.HostingTask = HostingTask;
    this.HostingCdnSharedService = HostingCdnSharedService;
    this.HostingCdnOrderService = HostingCdnOrderService;
    this.indyLink = indyLink;
    this.localSEOLink = localSEOLink;
    this.moduleLink = moduleLink;
    this.multisiteLink = multisiteLink;
    this.pendingTasks = pendingTasks;
    this.PrivateDatabase = PrivateDatabase;
    this.privateDatabasesDetachable = privateDatabasesDetachable;
    this.privateDatabasesIds = privateDatabasesIds;
    this.runtimesLink = runtimesLink;
    this.taskLink = taskLink;
    this.user = user;
    this.userLogsLink = userLogsLink;
    this.OVH_ORDER_URLS = OVH_ORDER_URLS;
    this.serviceName = serviceName;
  }

  $onInit() {
    this.$scope.loadingHostingInformations = true;
    this.$scope.loadingHostingError = false;
    this.$scope.urls = {
      hosting: '',
    };
    this.$scope.edit = {
      active: false,
    };

    this.$scope.availableOptions = this.availableOptions;
    this.$scope.emailOptionIds = this.emailOptionIds;
    this.$scope.emailOptionDetachInformation = this.emailOptionDetachInformation;
    this.$scope.privateDatabasesDetachable = this.privateDatabasesDetachable;
    this.$scope.goToDetachEmail = this.goToDetachEmail;
    this.$scope.goToDetachPrivateDB = this.goToDetachPrivateDB;
    this.$scope.pendingTasks = this.pendingTasks;

    this.$scope.stepPath = '';
    this.$scope.currentAction = null;
    this.$scope.currentActionData = null;
    this.$scope.newDisplayName = {
      value: '',
    };
    this.$scope.displayMore = {
      value: false,
    };

    this.$scope.ovhSubsidiary = this.user.ovhSubsidiary;

    this.$scope.alerts = {
      page: 'app.alerts.page',
      tabs: 'app.alerts.tabs',
      main: 'app.alerts.main',
      database: 'app.alerts.database',
    };

    this.$scope.urlDomainOrder = null;

    this.$scope.ovhConfig = null;

    this.$scope.convertBytesSize = (nb, unit, decimalWanted = 0) => {
      if (nb == null || unit == null) {
        return '';
      }

      const res = filesize(this.WucConverterService.convertToOctet(nb, unit), {
        output: 'object',
        round: decimalWanted,
        base: -1,
      });
      const resUnit = this.$translate.instant(`unit_size_${res.symbol}`);

      return `${res.value} ${resUnit}`;
    };

    this.WucUser.getUrlOf('changeOwner').then((link) => {
      this.$scope.changeOwnerUrl = link;
    });

    this.$scope.$on(this.HostingOvhConfig.events.ovhConfigNeedRefresh, () => {
      this.loadOvhConfig();
    });

    this.$scope.goToPrivateDb = (privateDb) => {
      this.$rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
        name: privateDb,
        type: 'PRIVATE_DATABASE',
      });
      this.Navigator.navigate(`configuration/private_database/${privateDb}`);
    };

    this.$scope.userInfos = {};

    this.$scope.getUserInfos = () =>
      this.WucUser.getUser()
        .then((user) => {
          this.$scope.userInfos = user;
        })
        .catch((err) => this.$q.reject(err));

    this.$scope.isAdminPrivateDb = (privateDb) =>
      this.$scope
        .getUserInfos()
        .then(() => this.PrivateDatabase.getServiceInfos(privateDb))
        .then((privateDbInfo) =>
          some(
            [
              privateDbInfo.contactBilling,
              privateDbInfo.contactTech,
              privateDbInfo.contactAdmin,
            ],
            (contactName) => this.$scope.userInfos.nichandle === contactName,
          ),
        )
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('common_serviceinfos_error', {
              t0: privateDb,
            }),
            err,
            this.$scope.alerts.main,
          );
          return false;
        });

    this.$scope.editDisplayName = () => {
      this.$scope.newDisplayName.value =
        this.$scope.hosting.displayName || this.$scope.hosting.serviceName;
      this.$scope.edit.active = true;
    };

    this.$scope.saveDisplayName = () => {
      const displayName =
        this.$scope.newDisplayName.value || this.$scope.hosting.serviceName;
      this.Hosting.updateHosting(this.$stateParams.productId, {
        body: {
          displayName,
        },
      })
        .then(() => {
          this.$rootScope.$broadcast('change.displayName', [
            this.$scope.hosting.serviceName,
            displayName,
          ]);
          this.$timeout(() => {
            this.$scope.hosting.displayName = displayName;
          }, 0);
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_dashboard_loading_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.$scope.edit.active = false;
        });
    };

    this.$scope.resetDisplayName = () => {
      this.$scope.edit.active = false;
    };

    this.$scope.getStateBadgeClass = () => {
      switch (get(this.$scope.hosting, 'serviceState')) {
        case 'ACTIVE':
          return 'oui-badge_success';
        case 'MAINTENANCE':
          return 'oui-badge_warning';
        case 'BLOQUED':
          return 'oui-badge_error';
        default:
          return null;
      }
    };

    this.$scope.$on('hosting.cdn.flush.refresh', () => {
      this.checkFlushCdnState();
    });

    this.$scope.$on('$destroy', () => {
      this.Hosting.killPollFlushCdn();
      this.Hosting.killPollSqlPrive();
    });

    this.$scope.$on('hosting.database.sqlPrive', () => {
      this.checkSqlPriveState();
    });

    // FLUSH CDN
    this.$scope.resetAction = () => {
      this.$scope.setAction(false);
    };

    this.$scope.$on('$locationChangeStart', () => {
      this.$scope.resetAction();
    });

    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (action) {
        this.$scope.stepPath = `hosting/${this.$scope.currentAction}.html`;
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

    this.$scope.getOfferPrivateSQLInfo = () => {
      this.$scope.hosting.sqlPriveInfo = {
        nbDataBaseActive: 0,
        nbDataBaseInclude: 0,
      };

      return this.HostingDatabase.getHasPrivateSqlToActivate(
        this.$stateParams.productId,
      ).then((hasPrivateSqlToActivate) => {
        this.$scope.hosting.sqlPriveInfo.hasPrivateDatabaseToActivate = hasPrivateSqlToActivate;
      });
    };

    //---------------------------------------------
    // POLLING
    //---------------------------------------------
    // Add domain
    this.$scope.$on('hostingDomain.attachDomain.start', () => {
      this.Alerter.success(
        this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_add_success_progress',
        ),
        this.$scope.alerts.main,
      );
    });

    this.$scope.$on('hostingDomain.attachDomain.done', () => {
      this.Alerter.success(
        this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_add_success_finish',
        ),
        this.$scope.alerts.main,
      );
    });

    this.$scope.$on('hostingDomain.attachDomain.error', (event, err) => {
      this.Alerter.alertFromSWS(
        this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_add_failure',
        ),
        get(err, 'data', err),
        this.$scope.alerts.main,
      );
    });

    // Modify domain
    this.$scope.$on('hostingDomain.modifyDomain.start', () => {
      this.Alerter.success(
        this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_modify_success_progress',
        ),
        this.$scope.alerts.main,
      );
    });

    this.$scope.$on('hostingDomain.modifyDomain.done', () => {
      this.$scope.$broadcast('paginationServerSide.reload');
      this.Alerter.success(
        this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_modify_success_finish',
        ),
        this.$scope.alerts.main,
      );
    });

    this.$scope.$on('hostingDomain.modifyDomain.error', (err) => {
      this.$scope.$broadcast('paginationServerSide.reload');
      this.Alerter.alertFromSWS(
        this.$translate.instant(
          'hosting_tab_DOMAINS_configuration_modify_failure',
        ),
        get(err, 'data', err),
        this.$scope.alerts.main,
      );
    });

    this.$scope.$on('$destroy', () => {
      this.HostingDomain.killAllPolling();
    });

    this.$scope.$on(this.Hosting.events.dashboardRefresh, () =>
      this.loadHosting(),
    );

    this.loadHosting();

    this.$scope.displayTabs = { cron: true, databases: true, modules: true };

    return this.Hosting.getSelected(this.$stateParams.productId)
      .then((hosting) =>
        isEmpty(hosting.offer)
          ? this.$q.when({ hosting })
          : this.$q.all({
              email: this.getAssociatedEmail(),
              indys: this.HostingIndy.getIndys(this.$stateParams.productId),
              freedoms: this.HostingFreedom.getFreedoms(
                this.$stateParams.productId,
                { forceRefresh: false },
              ),
              hosting,
            }),
      )
      .then(({ indys, freedoms, hosting }) => {
        this.hosting = hosting;
        this.indys = indys;
        this.freedoms = freedoms;
      });
  }

  loadOvhConfig() {
    this.HostingOvhConfig.getCurrent(this.$stateParams.productId).then(
      (ovhConfig) => {
        this.$scope.ovhConfig = merge(ovhConfig, {
          taskPending: get(this.$scope.ovhConfig, 'taskPending', false),
          taskPendingError: get(
            this.$scope.ovhConfig,
            'taskPendingError',
            false,
          ),
        });

        this.$scope.phpVersionSupport = find(
          this.$scope.hosting.phpVersions,
          (version) => {
            if (version.version.indexOf('.') === -1) {
              // eslint-disable-next-line no-param-reassign
              version.version = `${version.version}.0`;
            }

            return version.version === this.$scope.ovhConfig.engineVersion;
          },
        );

        let queue;
        if (this.pendingTasks && this.pendingTasks.length > 0) {
          const taskPendingMessage = this.$translate.instant(
            `hosting_global_php_version_pending_task_${this.pendingTasks[0].function.replace(
              /ovhConfig\//,
              '',
            )}`,
          );
          set(
            this.$scope.ovhConfig,
            'taskPending',
            taskPendingMessage ||
              this.$translate.instant(
                'hosting_global_php_version_pending_task_common',
              ),
          );

          queue = map(this.pendingTasks, (task) =>
            this.HostingTask.poll(this.$stateParams.productId, task).catch(
              () => {
                set(this.$scope.ovhConfig, 'taskPendingError', false);
              },
            ),
          );

          this.$q.all(queue).then(() => {
            this.loadOvhConfig();
          });
        } else {
          set(this.$scope.ovhConfig, 'taskPending', false);
        }

        this.HostingTask.getError(this.$stateParams.productId)
          .then((tasks) => {
            if (this.$scope.ovhConfig) {
              if (tasks && tasks.length > 0) {
                const taskErrorMessage = this.$translate.instant(
                  `hosting_global_php_version_pending_task_error_${tasks[0].function.replace(
                    /ovhConfig\//,
                    '',
                  )}`,
                );
                set(
                  this.$scope.ovhConfig,
                  'taskPendingError',
                  taskErrorMessage ||
                    this.$translate.instant(
                      'hosting_global_php_version_pending_task_error_common',
                    ),
                );
              } else {
                set(this.$scope.ovhConfig, 'taskPendingError', false);
              }
            }
          })
          .catch(() => {
            set(this.$scope.ovhConfig, 'taskPendingError', false);
          });
      },
    );
  }

  // FLUSH CDN
  checkFlushCdnState() {
    this.$scope.flushCdnState = 'check';
    this.Hosting.checkTaskUnique(this.$stateParams.productId, 'cdn/flush').then(
      (taskIds) => {
        if (taskIds && taskIds.length) {
          this.$scope.flushCdnState = 'doing';
          this.$rootScope.$broadcast(this.Hosting.events.tasksChanged);
          this.Hosting.pollFlushCdn(this.$stateParams.productId, taskIds).then(
            () => {
              this.$rootScope.$broadcast(this.Hosting.events.tasksChanged);
              this.$scope.flushCdnState = 'ok';
              this.Alerter.success(
                this.$translate.instant(
                  'hosting_dashboard_cdn_flush_done_success',
                ),
                this.$scope.alerts.main,
              );
            },
          );
        } else {
          this.$scope.flushCdnState = 'ok';
        }
      },
    );
  }

  checkSqlPriveState() {
    this.$scope.sqlPriveState = 'check';
    this.Hosting.checkTaskUnique(
      this.$stateParams.productId,
      'hosting/activate/privateDatabase',
    ).then((taskIds) => {
      if (taskIds && taskIds.length) {
        this.$scope.sqlPriveState = 'doing';
        this.Hosting.pollSqlPrive(this.$stateParams.productId, taskIds).then(
          () => {
            this.$scope.sqlPriveState = 'ok';
            this.Alerter.success(
              this.$translate.instant(
                'hosting_dashboard_database_active_success_done',
              ),
            );
          },
        );
      } else {
        this.$scope.sqlPriveState = 'ok';
      }
    });
  }

  getPrivateDatabases() {
    return this.$q.all(
      this.privateDatabasesIds.map((id) =>
        this.$scope.isAdminPrivateDb(id).then((isAdmin) => ({
          name: id,
          isAdmin,
        })),
      ),
    );
  }

  startPolling() {
    this.$q
      .all([
        this.HostingDomain.getTaskIds(
          { fn: 'attachedDomain/create' },
          this.$stateParams.productId,
        ),
        this.HostingDomain.getTaskIds(
          { fn: 'attachedDomain/update' },
          this.$stateParams.productId,
        ),
      ])
      .then((tasks) => {
        const taskIds = union(tasks[0], tasks[1]);
        ['attachedDomain/create', 'attachedDomain/update'].forEach(
          (name, key) => {
            if (tasks[key].length > 0) {
              this.HostingDomain.pollRequest({
                taskIds,
                namespace: name,
                serviceName: this.$scope.hosting.serviceName,
              });
            }
          },
        );
      });
  }

  getAutorenewUrl(guides) {
    this.$scope.autorenew = {
      guide: guides.autorenew,
      url: this.coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
        selectedType: 'HOSTING_WEB',
        searchText: this.$scope.hosting.serviceInfos.domain,
      }),
    };
  }

  getAssociatedEmail() {
    return this.$http
      .get(`/hosting/web/${this.serviceName}/emailOption`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      })
      .then(({ data }) => data)
      .then(([email]) => {
        this.associatedEmail = email;
      });
  }

  loadHosting() {
    return this.Hosting.getSelected(this.$stateParams.productId, true)
      .then((hosting) => {
        this.$scope.hosting = hosting;
        this.$scope.hosting.displayName =
          hosting.displayName || hosting.serviceDisplayName;
        this.$scope.isAdminPvtDb = false;

        if (!hosting.isExpired && hosting.messages.length > 0) {
          this.Alerter.error(
            this.$translate.instant('hosting_dashboard_loading_error'),
            this.$scope.alerts.page,
          );
          if (!hosting.name) {
            return this.$q.reject();
          }
        }

        if (!hosting.isExpired) {
          this.checkFlushCdnState();
          this.checkSqlPriveState();
          this.$scope.getOfferPrivateSQLInfo();
        }

        return this.$q.all({
          serviceInfos: this.Hosting.getServiceInfos(
            this.$stateParams.productId,
          ),
          hostingProxy: this.Hosting.getHosting(this.$stateParams.productId),
          hostingUrl: this.OVH_ORDER_URLS.orderHosting[this.user.ovhSubsidiary],
          domainOrderUrl: this.OVH_ORDER_URLS.orderDomain[
            this.user.ovhSubsidiary
          ],
        });
      })
      .then(({ serviceInfos, hostingProxy, hostingUrl, domainOrderUrl }) => {
        this.$scope.hosting.serviceInfos = serviceInfos;
        this.$scope.hostingProxy = hostingProxy;
        this.$scope.ftp = hostingProxy.serviceManagementAccess.ftp;
        this.$scope.ftpUrl = `ftp://${hostingProxy.serviceManagementAccess.ftp.url}:${hostingProxy.serviceManagementAccess.ftp.port}/`;
        this.$scope.http = hostingProxy.serviceManagementAccess.http;
        this.$scope.httpUrl = `http://${hostingProxy.serviceManagementAccess.http.url}:${hostingProxy.serviceManagementAccess.http.port}/`;
        this.$scope.isCdnFree =
          this.Hosting.constructor.isPerfOffer(hostingProxy.offer) ||
          this.$scope.hosting.isCloudWeb;
        this.$scope.ssh = hostingProxy.serviceManagementAccess.ssh;
        this.$scope.sshUrl = `ssh://${hostingProxy.serviceManagementAccess.ssh.url}:${hostingProxy.serviceManagementAccess.ssh.port}/`;
        this.$scope.urls.hosting = hostingUrl;
        this.$scope.urlDomainOrder = domainOrderUrl;

        return this.WucUser.getUrlOf('guides');
      })
      .then((guides) => {
        if (guides) {
          // GLOBAL ALERT TO UPGRADE APACHE
          if (indexOf(this.$scope.hosting.updates, 'APACHE24') >= 0) {
            this.$timeout(() => {
              this.Alerter.alertFromSWS(
                this.$translate.instant(
                  'hosting_global_php_version_pending_update_apache',
                  {
                    t0: guides.works.apache,
                    t1: 'http://travaux.ovh.net/?do=details&id=25601',
                  },
                ),
                null,
                this.$scope.alerts.tabs,
              );
            }, 100);
          }

          switch (this.$scope.hosting.serviceState) {
            case 'BLOQUED':
              if (guides.hostingHackState) {
                this.$scope.guideHostingState = guides.hostingHackState;
              }
              break;
            case 'MAINTENANCE':
              if (guides.hostingDisabledState) {
                this.$scope.guideHostingState = guides.hostingDisabledState;
              }
              break;
            default:
              break;
          }

          this.getAutorenewUrl(guides);
        }
      })
      .then(() => {
        if (
          moment().isAfter(
            moment(this.$scope.hostingProxy.lastOvhConfigScan).add(12, 'hours'),
          )
        ) {
          return this.HostingOvhConfig.ovhConfigRefresh(
            this.$stateParams.productId,
            { returnErrorKey: '' },
          )
            .then((data) => data)
            .catch((err) => {
              if (get(err, 'status') === 403) {
                return null;
              }

              return get(err, 'data');
            });
        }
        return null;
      })
      .then(() => this.loadOvhConfig())
      .then(() => this.startPolling())
      .catch((err) => {
        this.$scope.hosting.serviceInfos = {};
        this.$scope.loadingHostingError = true;
        this.Alerter.error(err);
      })
      .then(() => this.handlePrivateDatabases())
      .then(() => this.isCDNUpgradeAvailable())
      .finally(() => {
        this.$scope.loadingHostingInformations = false;
      });
  }

  handlePrivateDatabases() {
    return this.getPrivateDatabases().then((privateDatabases) => {
      this.$scope.privateDatabases = privateDatabases;
    });
  }

  isCDNUpgradeAvailable() {
    const { serviceName } = this.$scope.hosting;
    return this.HostingCdnSharedService.hasAvailableUpgrades(
      serviceName,
      this.$scope.hosting.serviceInfos.serviceId,
    )
      .then((isUpgradeAvailable) => {
        this.$scope.isUpgradable = isUpgradeAvailable;
      })
      .catch(() => {
        this.$scope.isUpgradable = false;
      });
  }
}
