import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import merge from 'lodash/merge';
import set from 'lodash/set';
import some from 'lodash/some';
import union from 'lodash/union';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $q,
  $timeout,
  $translate,
  WucConverterService,
  Hosting,
  Alerter,
  Navigator,
  constants,
  User,
  HostingOvhConfig,
  HostingTask,
  HostingDatabase,
  HostingDomain,
  PrivateDatabase,
  $stateParams,
  HOSTING_STATUS,
) => {
  $scope.loadingHostingInformations = true;
  $scope.loadingHostingError = false;
  $scope.urls = {
    hosting: '',
  };
  $scope.edit = {
    active: false,
  };

  $scope.HOSTING_STATUS = HOSTING_STATUS;

  $scope.stepPath = '';
  $scope.currentAction = null;
  $scope.currentActionData = null;
  $scope.newDisplayName = {
    value: '',
  };
  $scope.displayMore = {
    value: false,
  };

  $scope.alerts = {
    page: 'app.alerts.page',
    tabs: 'app.alerts.tabs',
    main: 'app.alerts.main',
  };

  $scope.urlDomainOrder = null;

  $scope.ovhConfig = null;

  $scope.convertBytesSize = (nb, unit, decimalWanted = 0) => {
    if (nb == null || unit == null) {
      return '';
    }

    const res = filesize(WucConverterService.convertToOctet(nb, unit), {
      output: 'object',
      round: decimalWanted,
      base: -1,
    });
    const resUnit = $translate.instant(`unit_size_${res.symbol}`);

    return `${res.value} ${resUnit}`;
  };

  User.getUrlOf('changeOwner').then((link) => {
    $scope.changeOwnerUrl = link;
  });

  function loadOvhConfig() {
    HostingOvhConfig.getCurrent($stateParams.productId).then((ovhConfig) => {
      $scope.ovhConfig = merge(ovhConfig, {
        taskPending: get($scope.ovhConfig, 'taskPending', false),
        taskPendingError: get($scope.ovhConfig, 'taskPendingError', false),
      });

      $scope.phpVersionSupport = find(
        $scope.hosting.phpVersions,
        (version) => {
          if (version.version.indexOf('.') === -1) {
            version.version = `${version.version}.0`; // eslint-disable-line no-param-reassign
          }

          return version.version === $scope.ovhConfig.engineVersion;
        },
      );

      HostingTask.getPending($stateParams.productId)
        .then((tasks) => {
          let queue;
          if (tasks && tasks.length > 0) {
            const taskPendingMessage = $translate.instant(`hosting_global_php_version_pending_task_${tasks[0].function.replace(
              /ovhConfig\//,
              '',
            )}`);
            set(
              $scope.ovhConfig,
              'taskPending',
              taskPendingMessage
                || $translate.instant('hosting_global_php_version_pending_task_common'),
            );

            queue = map(
              tasks,
              task => HostingTask
                .poll($stateParams.productId, task)
                .catch(() => {
                  set($scope.ovhConfig, 'taskPendingError', false);
                }),
            );

            $q.all(queue).then(() => {
              loadOvhConfig();
            });
          } else {
            set($scope.ovhConfig, 'taskPending', false);
          }
        })
        .catch(() => {
          set($scope.ovhConfig, 'taskPending', false);
        });

      HostingTask.getError($stateParams.productId)
        .then((tasks) => {
          if ($scope.ovhConfig) {
            if (tasks && tasks.length > 0) {
              const taskErrorMessage = $translate.instant(`hosting_global_php_version_pending_task_error_${tasks[0].function.replace(
                /ovhConfig\//,
                '',
              )}`);
              set(
                $scope.ovhConfig,
                'taskPendingError',
                taskErrorMessage
                  || $translate.instant('hosting_global_php_version_pending_task_error_common'),
              );
            } else {
              set($scope.ovhConfig, 'taskPendingError', false);
            }
          }
        })
        .catch(() => {
          set($scope.ovhConfig, 'taskPendingError', false);
        });
    });
  }

  $scope.$on(HostingOvhConfig.events.ovhConfigNeedRefresh, () => {
    loadOvhConfig();
  });

  $scope.goToPrivateDb = (privateDb) => {
    $rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
      name: privateDb,
      type: 'PRIVATE_DATABASE',
    });
    Navigator.navigate(`configuration/private_database/${privateDb}`);
  };

  $scope.userInfos = {};

  $scope.getUserInfos = () => User.getUser()
    .then((user) => {
      $scope.userInfos = user;
    })
    .catch(err => $q.reject(err));

  $scope.isAdminPrivateDb = privateDb => $scope
    .getUserInfos()
    .then(() => PrivateDatabase.getServiceInfos(privateDb))
    .then(privateDbInfo => some(
      [
        privateDbInfo.contactBilling,
        privateDbInfo.contactTech,
        privateDbInfo.contactAdmin,
      ],
      contactName => $scope.userInfos.nichandle === contactName,
    ))
    .catch((err) => {
      Alerter.alertFromSWS(
        $translate.instant('common_serviceinfos_error', { t0: privateDb }),
        err,
        $scope.alerts.main,
      );
      return false;
    });

  // FLUSH CDN
  function checkFlushCdnState() {
    $scope.flushCdnState = 'check';
    Hosting.checkTaskUnique($stateParams.productId, 'web/flushCache').then((taskIds) => {
      if (taskIds && taskIds.length) {
        $scope.flushCdnState = 'doing';
        $rootScope.$broadcast(Hosting.events.tasksChanged);
        Hosting.pollFlushCdn($stateParams.productId, taskIds).then(() => {
          $rootScope.$broadcast(Hosting.events.tasksChanged);
          $scope.flushCdnState = 'ok';
          Alerter.success(
            $translate.instant('hosting_dashboard_cdn_flush_done_success'),
            $scope.alerts.main,
          );
        });
      } else {
        $scope.flushCdnState = 'ok';
      }
    });
  }

  function checkSqlPriveState() {
    $scope.sqlPriveState = 'check';
    Hosting.checkTaskUnique(
      $stateParams.productId,
      'hosting/activate/privateDatabase',
    ).then((taskIds) => {
      if (taskIds && taskIds.length) {
        $scope.sqlPriveState = 'doing';
        Hosting.pollSqlPrive($stateParams.productId, taskIds).then(() => {
          $scope.sqlPriveState = 'ok';
          Alerter.success($translate.instant('hosting_dashboard_database_active_success_done'));
        });
      } else {
        $scope.sqlPriveState = 'ok';
      }
    });
  }

  function setUrchin() {
    if (
      ['gra1', 'gra2'].includes($scope.hostingProxy.datacenter)
    ) {
      // FOR GRAVELINE
      $scope.urchin = URI.expand(constants.urchin_gra, {
        serviceName: $scope.hosting.serviceName,
        cluster: $scope.hostingProxy.cluster,
      }).toString();
    } else {
      $scope.urchin = URI.expand(constants.urchin, {
        serviceName: $scope.hosting.serviceName,
        cluster: $scope.hostingProxy.cluster,
      }).toString();
    }
  }

  function getLinkedPrivateDatabases() {
    return Hosting.getPrivateDatabasesLinked($stateParams.productId)
      .then(databases => $q.all(
        databases.map(databaseName => $scope.isAdminPrivateDb(databaseName)
          .then(isAdmin => ({
            name: databaseName,
            isAdmin,
          }))),
      ));
  }

  $scope.editDisplayName = () => {
    $scope.newDisplayName.value = $scope.hosting.displayName || $scope.hosting.serviceName;
    $scope.edit.active = true;
  };

  $scope.saveDisplayName = () => {
    const displayName = $scope.newDisplayName.value || $scope.hosting.serviceName;
    Hosting.updateHosting($stateParams.productId, {
      body: {
        displayName,
      },
    })
      .then(() => {
        $rootScope.$broadcast('change.displayName', [
          $scope.hosting.serviceName,
          displayName,
        ]);
        $timeout(() => {
          $scope.hosting.displayName = displayName;
        }, 0);
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        Alerter.alertFromSWS(
          $translate.instant('hosting_dashboard_loading_error'),
          err,
          $scope.alerts.main,
        );
      })
      .finally(() => {
        $scope.edit.active = false;
      });
  };

  $scope.resetDisplayName = () => {
    $scope.edit.active = false;
  };

  $scope.getStateBadgeClass = () => {
    switch (get($scope.hosting, 'serviceState')) {
      case 'ACTIVE':
        return 'oui-status_success';
      case 'MAINTENANCE':
        return 'oui-status_warning';
      case 'BLOQUED':
        return 'oui-status_error';
      default:
        return null;
    }
  };

  $scope.$on('hosting.cdn.flush.refresh', () => {
    checkFlushCdnState();
  });

  $scope.$on('$destroy', () => {
    Hosting.killPollFlushCdn();
    Hosting.killPollSqlPrive();
  });

  $scope.$on('hosting.database.sqlPrive', () => {
    checkSqlPriveState();
  });

  // FLUSH CDN
  $scope.resetAction = () => {
    $scope.setAction(false);
  };

  $scope.$on('$locationChangeStart', () => {
    $scope.resetAction();
  });

  $scope.setAction = (action, data) => {
    $scope.currentAction = action;
    $scope.currentActionData = data;

    if (action) {
      $scope.stepPath = `hosting/${$scope.currentAction}.html`;
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

  $scope.getOfferPrivateSQLInfo = () => {
    $scope.hosting.sqlPriveInfo = {
      nbDataBaseActive: 0,
      nbDataBaseInclude: 0,
      offerCapabilitiesPDB: null,
      databaseCreationCapabilitiesPDB: null,
    };

    HostingDatabase.getPrivateDatabaseCapabilities($stateParams.productId)
      .then((privateDbCapabilities) => {
        $scope.hosting.sqlPriveInfo.nbDataBaseInclude = $scope.hosting
          .offerCapabilities.privateDatabases.length;
        $scope.hosting.sqlPriveInfo.nbDataBaseActive = $scope.hosting
          .sqlPriveInfo.nbDataBaseInclude - privateDbCapabilities.length;
      });
  };

  //---------------------------------------------
  // POLLING
  //---------------------------------------------
  // Add domain
  $scope.$on('hostingDomain.attachDomain.start', () => {
    Alerter.success(
      $translate.instant('hosting_tab_DOMAINS_configuration_add_success_progress'),
      $scope.alerts.main,
    );
  });

  $scope.$on('hostingDomain.attachDomain.done', () => {
    Alerter.success(
      $translate.instant('hosting_tab_DOMAINS_configuration_add_success_finish'),
      $scope.alerts.main,
    );
  });

  $scope.$on('hostingDomain.attachDomain.error', (event, err) => {
    Alerter.alertFromSWS(
      $translate.instant('hosting_tab_DOMAINS_configuration_add_failure'),
      get(err, 'data', err),
      $scope.alerts.main,
    );
  });

  // Modify domain
  $scope.$on('hostingDomain.modifyDomain.start', () => {
    Alerter.success(
      $translate.instant('hosting_tab_DOMAINS_configuration_modify_success_progress'),
      $scope.alerts.main,
    );
  });

  $scope.$on('hostingDomain.modifyDomain.done', () => {
    $scope.$broadcast('paginationServerSide.reload');
    Alerter.success(
      $translate.instant('hosting_tab_DOMAINS_configuration_modify_success_finish'),
      $scope.alerts.main,
    );
  });

  $scope.$on('hostingDomain.modifyDomain.error', (err) => {
    $scope.$broadcast('paginationServerSide.reload');
    Alerter.alertFromSWS(
      $translate.instant('hosting_tab_DOMAINS_configuration_modify_failure'),
      get(err, 'data', err),
      $scope.alerts.main,
    );
  });

  function startPolling() {
    $q.all([
      HostingDomain.getTaskIds(
        { fn: 'attachedDomain/create' },
        $stateParams.productId,
      ),
      HostingDomain.getTaskIds(
        { fn: 'attachedDomain/update' },
        $stateParams.productId,
      ),
    ]).then((tasks) => {
      const taskIds = union(tasks[0], tasks[1]);
      ['attachedDomain/create', 'attachedDomain/update'].forEach((name, key) => {
        if (tasks[key].length > 0) {
          HostingDomain.pollRequest({
            taskIds,
            namespace: name,
            serviceName: $scope.hosting.serviceName,
          });
        }
      });
    });
  }

  $scope.$on('$destroy', () => {
    HostingDomain.killAllPolling();
  });

  function getAutorenewUrl(guides) {
    $scope.autorenew = {
      guide: guides.autorenew,
      url: `${constants.AUTORENEW_URL}?selectedType=HOSTING_WEB&searchText=${$scope.hosting.serviceInfos.domain}`,
    };
  }

  function loadHosting() {
    return Hosting.getSelected($stateParams.productId, true)
      .then(
        (hosting) => {
          $scope.hosting = hosting;
          $scope.hosting.displayName = hosting.displayName || hosting.serviceDisplayName;
          $scope.isAdminPvtDb = false;

          if (!hosting.isExpired && hosting.messages.length > 0) {
            Alerter.error(
              $translate.instant('hosting_dashboard_loading_error'),
              $scope.alerts.page,
            );
            if (!hosting.name) {
              return $q.reject();
            }
          }

          if (!hosting.isExpired) {
            checkFlushCdnState();
            checkSqlPriveState();
            $scope.getOfferPrivateSQLInfo();
          }

          return $q.all({
            serviceInfos: Hosting.getServiceInfos($stateParams.productId),
            hostingProxy: Hosting.getHosting($stateParams.productId),
            hostingUrl: User.getUrlOfEndsWithSubsidiary('hosting'),
            linkedDatabases: getLinkedPrivateDatabases,
            domainOrderUrl: User.getUrlOf('domainOrder'),
          });
        },
      )
      .then(({
        serviceInfos, hostingProxy, hostingUrl, databases, domainOrderUrl,
      }) => {
        $scope.hosting.serviceInfos = serviceInfos;
        $scope.hostingProxy = hostingProxy;
        $scope.ftp = hostingProxy.serviceManagementAccess.ftp;
        $scope.ftpUrl = `ftp://${hostingProxy.serviceManagementAccess.ftp.url}:${hostingProxy.serviceManagementAccess.ftp.port}/`;
        $scope.http = hostingProxy.serviceManagementAccess.http;
        $scope.httpUrl = `http://${hostingProxy.serviceManagementAccess.http.url}:${hostingProxy.serviceManagementAccess.http.port}/`;
        $scope.ssh = hostingProxy.serviceManagementAccess.ssh;
        $scope.sshUrl = `ssh://${hostingProxy.serviceManagementAccess.ssh.url}:${hostingProxy.serviceManagementAccess.ssh.port}/`;
        $scope.urls.hosting = hostingUrl;
        $scope.privateDatabasesLinked = databases;
        $scope.urlDomainOrder = domainOrderUrl;
        setUrchin();

        return User.getUrlOf('guides');
      })
      .then((guides) => {
        if (guides) {
        // GLOBAL ALERT TO UPGRADE APACHE
          if (indexOf($scope.hosting.updates, 'APACHE24') >= 0) {
            $timeout(() => {
              Alerter.alertFromSWS(
                $translate.instant('hosting_global_php_version_pending_update_apache', {
                  t0: guides.works.apache,
                  t1: 'http://travaux.ovh.net/?do=details&id=25601',
                }), null, $scope.alerts.tabs,
              );
            }, 100);
          }

          switch ($scope.hosting.serviceState) {
            case 'BLOQUED':
              if (guides.hostingHackState) {
                $scope.guideHostingState = guides.hostingHackState;
              }
              break;
            case 'MAINTENANCE':
              if (guides.hostingDisabledState) {
                $scope.guideHostingState = guides.hostingDisabledState;
              }
              break;
            default:
              break;
          }

          getAutorenewUrl(guides);
        }
      })
      .then(() => {
        if (moment().isAfter(moment($scope.hostingProxy.lastOvhConfigScan).add(12, 'hours'))) {
          return HostingOvhConfig.ovhConfigRefresh($stateParams.productId, { returnErrorKey: '' }).then(data => data).catch((err) => {
            if (get(err, 'status') === 403) {
              return null;
            }

            return get(err, 'data');
          });
        }
        return null;
      })
      .then(() => loadOvhConfig())
      .then(() => startPolling())
      .catch((err) => {
        $scope.hosting.serviceInfos = {};
        $scope.loadingHostingError = true;
        Alerter.error(err);
      })
      .finally(() => {
        $scope.loadingHostingInformations = false;
      });
  }

  $scope.$on(Hosting.events.dashboardRefresh, () => {
    loadHosting();
  });

  loadHosting();
};
