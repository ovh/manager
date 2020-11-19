import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import kebabCase from 'lodash/kebabCase';
import map from 'lodash/map';
import merge from 'lodash/merge';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';
import union from 'lodash/union';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from './cdn/order/hosting-cdn-order.constant';

export default class {
  /* @ngInject */
  constructor(
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
    constants,
    availableOptions,
    emailOptionIds,
    emailOptionDetachInformation,
    isEmailDomainAvailable,
    isLocalSeoAvailable,
    goToDetachEmail,
    goToDetachPrivateDB,
    User,
    HostingDatabase,
    HostingDomain,
    HostingFreedom,
    HostingIndy,
    HostingOvhConfig,
    HostingTask,
    HostingCdnSharedService,
    HostingCdnOrderService,
    logs,
    pendingTasks,
    PrivateDatabase,
    privateDatabasesDetachable,
    privateDatabasesIds,
    user,
    HOSTING_STATUS,
    OVH_ORDER_URLS,
  ) {
    this.$scope = $scope;
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
    this.constants = constants;
    this.availableOptions = availableOptions;
    this.emailOptionIds = emailOptionIds;
    this.emailOptionDetachInformation = emailOptionDetachInformation;
    this.isEmailDomainAvailable = isEmailDomainAvailable;
    this.isLocalSeoAvailable = isLocalSeoAvailable;
    this.goToDetachEmail = goToDetachEmail;
    this.goToDetachPrivateDB = goToDetachPrivateDB;
    this.User = User;
    this.HostingDatabase = HostingDatabase;
    this.HostingDomain = HostingDomain;
    this.HostingFreedom = HostingFreedom;
    this.HostingIndy = HostingIndy;
    this.HostingOvhConfig = HostingOvhConfig;
    this.HostingTask = HostingTask;
    this.HostingCdnSharedService = HostingCdnSharedService;
    this.HostingCdnOrderService = HostingCdnOrderService;
    this.pendingTasks = pendingTasks;
    this.PrivateDatabase = PrivateDatabase;
    this.privateDatabasesDetachable = privateDatabasesDetachable;
    this.privateDatabasesIds = privateDatabasesIds;
    this.user = user;
    this.OVH_ORDER_URLS = OVH_ORDER_URLS;
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

    this.User.getUrlOf('changeOwner').then((link) => {
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
      this.User.getUser()
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

    // Tabs
    this.defaultTab = 'GENERAL_INFORMATIONS';
    this.tabs = [
      'GENERAL_INFORMATIONS',
      'MULTISITE',
      'MODULE',
      'FTP',
      'DATABASE',
      'TASK',
    ];
    this.$scope.displayTabs = { cron: true, databases: true, modules: true };

    this.setSelectedTab = this.setSelectedTab.bind(this);

    if (
      this.$stateParams.tab &&
      this.tabs.indexOf(
        isString(this.$stateParams.tab) && this.$stateParams.tab.toUpperCase(),
      ) !== -1
    ) {
      this.setSelectedTab(
        isString(this.$stateParams.tab) && this.$stateParams.tab.toUpperCase(),
      );
    } else {
      this.setSelectedTab(this.defaultTab);
    }

    return this.$q
      .all({
        hosting: this.Hosting.getSelected(this.$stateParams.productId),
        user: this.User.getUser(),
      })
      .then(({ hosting, user }) =>
        isEmpty(hosting.offer)
          ? this.$q.when({ hosting, user })
          : this.$q.all({
              indys: this.HostingIndy.getIndys(this.$stateParams.productId),
              freedoms: this.HostingFreedom.getFreedoms(
                this.$stateParams.productId,
                { forceRefresh: false },
              ),
              hosting,
              user,
            }),
      )
      .then(({ indys, freedoms, hosting, user }) => {
        this.tabMenu = {
          title: this.$translate.instant('navigation_more'),
          items: [
            {
              label: this.$translate.instant('hosting_tab_AUTOMATED_EMAILS'),
              text: this.$translate.instant(
                'hosting_tab_AUTOMATED_EMAILS_desc',
              ),
              target: 'AUTOMATED_EMAILS',
              type: 'SWITCH_TABS',
            },
          ],
        };

        if (hosting.isCloudWeb) {
          remove(this.tabs, (t) => t === 'TASK');
          this.tabs.splice(1, 0, 'RUNTIMES', 'ENVVARS');
          this.tabMenu.items.splice(0, 0, {
            label: this.$translate.instant('hosting_tab_TASK'),
            target: 'TASK',
            type: 'SWITCH_TABS',
          });
        }

        this.tabMenu.items = this.tabMenu.items.concat([
          {
            label: this.$translate.instant('hosting_tab_menu_crons'),
            target: 'CRON',
            type: 'SWITCH_TABS',
          },
          {
            label: this.$translate.instant('hosting_tab_USER_LOGS'),
            target: 'USER_LOGS',
            type: 'SWITCH_TABS',
          },
        ]);

        if (!hosting.isCloudWeb) {
          this.tabMenu.items.push({
            label: this.$translate.instant('hosting_tab_BOOST'),
            target: 'BOOST',
            type: 'SWITCH_TABS',
          });
        }

        if (!isEmpty(indys)) {
          this.tabMenu.items.push({
            label: this.$translate.instant('hosting_tab_INDY'),
            target: 'INDY',
            type: 'SWITCH_TABS',
          });
        }

        if (!isEmpty(freedoms)) {
          this.tabMenu.items.push({
            label: this.$translate.instant('hosting_tab_FREEDOM'),
            target: 'FREEDOM',
            type: 'SWITCH_TABS',
          });
        }

        if (this.isLocalSeoAvailable) {
          this.tabs.splice(indexOf(this.tabs, 'FTP'), 0, 'LOCAL_SEO');
        }

        if (user.ovhSubsidiary === 'FR') {
          this.tabMenu.items.push({
            label: this.$translate.instant('hosting_tab_WEBSITE_COACH'),
            styles: 'status-beta',
            state: 'app.hosting.website-coach',
            target: 'WEBSITE_COACH',
            type: 'STATE',
          });
          this.$scope.localSeoAvailable = true;
        }

        if (!hosting.isCloudWeb && this.isEmailDomainAvailable) {
          this.tabMenu.items.push([
            {
              type: 'SEPARATOR',
            },
            {
              label: this.$translate.instant('hosting_tab_menu_emails'),
              target: `#/configuration/email-domain/${this.$stateParams.productId}?tab=MAILING_LIST`,
              type: 'LINK',
            },
          ]);
        }
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('hosting_tab_generic_error'),
          this.$scope.alerts.page,
        );
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
    this.Hosting.checkTaskUnique(
      this.$stateParams.productId,
      'web/flushCache',
    ).then((taskIds) => {
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
    });
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
      url: `${this.constants.AUTORENEW_URL}?selectedType=HOSTING_WEB&searchText=${this.$scope.hosting.serviceInfos.domain}`,
    };
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
        return this.User.getUrlOf('guides');
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
      .then(() => this.handleCDNProperties())
      .then(() => this.simulateUpgradeAvailability())
      .finally(() => {
        this.$scope.loadingHostingInformations = false;
      });
  }

  handlePrivateDatabases() {
    return this.getPrivateDatabases().then((privateDatabases) => {
      this.$scope.privateDatabases = privateDatabases;
    });
  }

  handleCDNProperties() {
    return this.HostingCdnSharedService.getCDNProperties(
      this.$scope.hosting.serviceName,
    )
      .then(({ data: cdn }) => {
        this.$scope.cdnProperties = cdn;
      })
      .catch((err) => {
        this.Alerter.error(err);
        this.$scope.cdnProperties = null;
      });
  }

  /**
   * This function can be removed once all CDN has been migrated by AGORA
   * The isUpgradable variable can also removed
   * @returns {Promise<{}>}
   */
  async simulateUpgradeAvailability() {
    try {
      const cdnVersion = get(this.$scope.cdnProperties, 'version', '');
      const { serviceName } = this.$scope.hosting;
      if (cdnVersion === HOSTING_CDN_ORDER_CDN_VERSION_V1) {
        const {
          data: servInfo,
        } = await this.HostingCdnSharedService.getServiceInfo(serviceName);

        const {
          data: servOpts,
        } = await this.HostingCdnSharedService.getServiceOptions(
          servInfo.serviceId,
        );

        const { serviceId } = find(
          servOpts,
          ({ billing }) =>
            billing.plan.code.match('^cdn') &&
            billing.plan.code.match('_business$'),
        );

        const {
          data: addonPlans,
        } = await this.HostingCdnSharedService.getCatalogAddonsPlan(serviceId);

        const addonPlan = find(addonPlans, ({ planCode }) =>
          includes(['cdn-basic', 'cdn-basic-free'], planCode),
        );

        await this.HostingCdnOrderService.simulateCartForUpgrade(
          serviceName,
          addonPlan,
          serviceId,
        );
        this.$scope.isUpgradable = true;
        return {};
      }
      this.$scope.isUpgradable = true;
      return {};
    } catch (e) {
      this.$scope.isUpgradable = false;
      return {};
    }
  }

  setSelectedTab(tab) {
    if (includes(this.tabs, tab)) {
      this.selectedTab = tab;
    } else if (
      includes(
        map(
          this.tabMenu.items,
          (item) => item.type === 'SWITCH_TABS' && item.target,
        ),
        tab,
      )
    ) {
      this.selectedTab = tab;
    } else {
      this.selectedTab = this.defaultTab;
    }
    this.$location.search('tab', this.selectedTab);
  }

  static toKebabCase(str) {
    return kebabCase(str);
  }
}
