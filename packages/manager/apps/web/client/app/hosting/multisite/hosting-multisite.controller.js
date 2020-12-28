import assign from 'lodash/assign';
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import union from 'lodash/union';

angular
  .module('App')
  .controller(
    'HostingTabDomainsCtrl',
    (
      $scope,
      $q,
      $state,
      $stateParams,
      $location,
      $rootScope,
      $translate,
      atInternet,
      Hosting,
      HOSTING,
      HostingCdnSharedService,
      HOSTING_STATUS,
      HostingDomain,
      hostingSSLCertificate,
      hostingSSLCertificateType,
      Alerter,
    ) => {
      atInternet.trackPage({ name: 'web::hosting::multisites' });

      $scope.domains = null;
      $scope.sslLinked = [];
      $scope.HOSTING = HOSTING;
      $scope.HOSTING_STATUS = HOSTING_STATUS;
      $scope.showGuidesStatus = false;
      $scope.search = {
        text: null,
      };
      $scope.hasResult = false;
      $scope.loading = {
        domains: false,
        init: true,
        regeneratingSsl: false,
      };

      $scope.certificateTypes = hostingSSLCertificateType.constructor.getCertificateTypes();

      function sendTrackClick(hit) {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      }

      $scope.loadDomains = function loadDomains(count, offset) {
        $scope.loading.domains = true;

        if ($location.search().domain) {
          $scope.search.text = $location.search().domain;
        }

        $scope.excludeAttachedDomains = [
          $scope.hosting.cluster.replace(/^ftp/, $scope.hosting.primaryLogin),
        ];

        return Hosting.getTabDomains(
          $stateParams.productId,
          count,
          offset,
          $scope.search.text,
        )
          .then((domains) => {
            return HostingCdnSharedService.getSharedCDNDomains(
              $scope.hosting.serviceName,
            ).then(({ data: sharedDomains }) => {
              return { domains, sharedDomains };
            });
          })
          .then(({ domains, sharedDomains }) => {
            $scope.domains = domains;
            $scope.sharedDomains = sharedDomains;
            $scope.hasResult = !isEmpty($scope.domains);
            $scope.domains.list.results.forEach((domain) => {
              if (domain.status === HOSTING_STATUS.UPDATING) {
                HostingDomain.pollRestartDomain(
                  $stateParams.productId,
                  domain.name,
                );
              }
            });
          })
          .then(() =>
            hostingSSLCertificate.retrievingLinkedDomains(
              $stateParams.productId,
            ),
          )
          .then((sslLinked) => {
            const linkedSSLs = isArray(sslLinked) ? sslLinked : [sslLinked];

            $scope.domains.list.results = map(
              $scope.domains.list.results,
              (domain) => {
                const newDomain = clone(domain);
                newDomain.rawSsl = newDomain.ssl;

                if (includes(linkedSSLs, newDomain.name)) {
                  newDomain.ssl = newDomain.ssl ? 2 : 1;
                } else {
                  newDomain.ssl = newDomain.ssl ? 1 : 0;
                }

                return newDomain;
              },
            );
          })
          .then(() => Hosting.getSelected($stateParams.productId))
          .then((hosting) => {
            $scope.hosting = hosting;
            $scope.numberOfColumns = 5 + hosting.isCloudWeb + hosting.hasCdn;

            if (hosting.isCloudWeb) {
              const promises = map(
                filter(
                  $scope.domains.list.results,
                  (domain) => domain.runtimeId,
                ),
                (originalDomain) => {
                  const domain = clone(originalDomain);

                  return HostingDomain.getRuntimeConfiguration(
                    $stateParams.productId,
                    domain.runtimeId,
                  ).then((runtime) => {
                    domain.runtime = runtime;
                  });
                },
              );

              return $q.all(promises);
            }

            return null;
          })
          .then(() =>
            hostingSSLCertificate.retrievingCertificate($stateParams.productId),
          )
          .then((certificate) => {
            if (certificate.status === HOSTING_STATUS.REGENERATING) {
              HostingDomain.pollSslTask($scope.hosting.serviceName);
            }
            $scope.sslCertificate = certificate;
          })
          .catch((error) => {
            // 404 error means that the user has no SSL certificate
            if (error.status !== 404) {
              Alerter.alertFromSWS(
                $translate.instant('hosting_dashboard_ssl_details_error'),
                error,
                $scope.alerts.main,
              );
            }
          })
          .finally(() => {
            $location.search('domain', null);

            $scope.loading.domains = false;
            $scope.loading.init = false;
          });
      };

      $scope.detachDomain = (domain) => {
        sendTrackClick('web::hosting::multisites::detach-domain');
        $scope.setAction('multisite/delete/hosting-multisite-delete', domain);
      };

      $scope.isLetsEncryptCertificate = (sslCertificate) =>
        sslCertificate.provider ===
        $scope.certificateTypes.LETS_ENCRYPT.providerName;

      $scope.isSSLCertificateOperationInProgress = (sslCertificate) =>
        sslCertificate.status === HOSTING_STATUS.DELETING ||
        sslCertificate.status === HOSTING_STATUS.REGENERATING ||
        sslCertificate.status === HOSTING_STATUS.CREATING;

      $scope.modifyDomain = (domain) => {
        sendTrackClick('web::hosting::multisites::modify-domain');
        $scope.setAction('multisite/update/hosting-multisite-update', domain);
      };

      $scope.restartDomain = (domain) =>
        HostingDomain.restartVirtualHostOfAttachedDomain(
          $stateParams.productId,
          domain.name,
        )
          .then(() => {
            Alerter.success(
              $translate.instant('hosting_tab_DOMAINS_multisite_restart_start'),
              $scope.alerts.main,
            );
            assign(find($scope.domains.list.results, { name: domain.name }), {
              status: HOSTING_STATUS.UPDATING,
            });
            return HostingDomain.pollRestartDomain(
              $stateParams.productId,
              domain.name,
            );
          })
          .catch((err) => {
            $scope.$broadcast('paginationServerSide.reload');
            Alerter.alertFromSWS(
              $translate.instant('hosting_tab_DOMAINS_multisite_restart_error'),
              err,
              $scope.alerts.main,
            );
          });

      $scope.activateDomain = (domain) => {
        sendTrackClick('web::hosting::multisites::activate-domain');
        $state.go('app.hosting.cdn.shared', {
          domain,
          domainName: domain.domain,
        });
      };

      $scope.settingCdnDomain = (domain) => {
        sendTrackClick('web::hosting::multisites::modify-cdn');
        $state.go('app.hosting.cdn.shared', {
          domain,
          domainName: domain.domain,
        });
      };

      $scope.flushCdn = (domain) => {
        sendTrackClick('web::hosting::multisites::purge-cdn');
        $scope.setAction('/cdn/flush/hosting-cdn-flush', { domain });
      };

      $scope.$on('hostingDomain.restart.done', (response, data) => {
        assign(find($scope.domains.list.results, { name: data.domain }), {
          status: data.status,
        });
        Alerter.success(
          $translate.instant('hosting_tab_DOMAINS_multisite_restart_done', {
            t0: data.domain,
          }),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.restart.error', (event, err) => {
        $scope.$broadcast('paginationServerSide.reload');
        Alerter.alertFromSWS(
          $translate.instant('hosting_tab_DOMAINS_multisite_restart_error'),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      $scope.$on(Hosting.events.tabDomainsRefresh, () => {
        $scope.hasResult = false;
        $scope.loading.init = true;
        $scope.$broadcast('paginationServerSide.reload');
      });

      function reloadCurrentPage() {
        if (!$scope.loading.domains) {
          $scope.$broadcast('paginationServerSide.reload');
        }
      }

      $scope.$watch(
        'search.text',
        (newValue) => {
          if ($scope.search.text !== null) {
            if ($scope.search.text === '') {
              reloadCurrentPage();
            } else if ($scope.search.text === newValue) {
              reloadCurrentPage();
            }
          }
        },
        true,
      );

      //---------------------------------------------
      // POLLING
      //---------------------------------------------
      // Add domain
      $scope.$on('hostingDomain.attachDomain.start', () => {
        Alerter.success(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_add_success_progress',
          ),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.attachDomain.done', () => {
        $scope.$broadcast('paginationServerSide.reload');
        Alerter.success(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_add_success_finish',
          ),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.attachDomain.error', (event, err) => {
        $scope.$broadcast('paginationServerSide.reload');
        Alerter.alertFromSWS(
          $translate.instant('hosting_tab_DOMAINS_configuration_add_failure'),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      // Modify domain
      $scope.$on('hostingDomain.modifyDomain.start', () => {
        Alerter.success(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_modify_success_progress',
          ),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.modifyDomain.done', () => {
        reloadCurrentPage();
        Alerter.success(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_modify_success_finish',
          ),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.modifyDomain.error', (err) => {
        reloadCurrentPage();
        Alerter.alertFromSWS(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_modify_failure',
          ),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      // Remove domain
      $scope.$on('hostingDomain.detachDomain.start', () => {
        Alerter.success(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_remove_success_progress',
          ),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.detachDomain.done', () => {
        $scope.$broadcast('paginationServerSide.reload');
      });

      $scope.$on('hostingDomain.detachDomain.error', (event, err) => {
        $scope.$broadcast('paginationServerSide.reload');
        Alerter.alertFromSWS(
          $translate.instant(
            'hosting_tab_DOMAINS_configuration_remove_failure',
          ),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      // regenerate ssl
      $scope.$on('hostingDomain.regenerateSsl.start', () => {
        $scope.loading.regeneratingSsl = true;
        Alerter.success(
          $translate.instant(
            'hosting_tab_DOMAINS_multisite_generate_ssl_start',
          ),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.regenerateSsl.done', () => {
        $scope.loading.regeneratingSsl = false;
        $rootScope.$broadcast('hosting.ssl.reload');
        Alerter.success(
          $translate.instant('hosting_tab_DOMAINS_multisite_generate_ssl_done'),
          $scope.alerts.main,
        );
      });

      $scope.$on('hostingDomain.regenerateSsl.error', (event, err) => {
        $scope.loading.regeneratingSsl = false;
        $rootScope.$broadcast('hosting.ssl.reload');
        Alerter.alertFromSWS(
          $translate.instant(
            'hosting_tab_DOMAINS_multisite_generate_ssl_error',
          ),
          get(err, 'data', err),
          $scope.alerts.main,
        );
      });

      $scope.$on('hosting.ssl.reload', () => {
        hostingSSLCertificate
          .retrievingCertificate($stateParams.productId)
          .then((certificate) => {
            if (certificate.status === HOSTING_STATUS.REGENERATING) {
              HostingDomain.pollSslTask($scope.hosting.serviceName);
            }
            $scope.sslCertificate = certificate;
          });
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
          HostingDomain.getTaskIds(
            { fn: 'web/detachDomain' },
            $stateParams.productId,
          ),
        ]).then((tasks) => {
          const taskIds = union(tasks[0], tasks[1], tasks[2]);
          [
            'attachedDomain/create',
            'attachedDomain/update',
            'web/detachDomain',
          ].forEach((name, key) => {
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

      startPolling();
    },
  );
