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

import {
  CDN_STATUS,
  CDN_VERSION,
  DIAGNOSTIC_STATE,
  HOSTING_OFFER,
  HOSTING_TAB_DOMAINS,
} from './hosting-multisite.constants';

const CDN_STATISTICS_PERIOD = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'week',
  YEAR: 'year',
};

angular
  .module('App')
  .controller(
    'HostingTabDomainsCtrl',
    (
      $http,
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
      ChartFactory,
      WucUser,
    ) => {
      atInternet.trackPage({ name: 'web::hosting::multisites' });

      $scope.HOSTING_OFFER = HOSTING_OFFER;

      $scope.goToCdnConfiguration = function goToCdnConfiguration(domain) {
        $state.go('app.hosting.dashboard.multisite.cdnConfiguration', {
          domain,
        });
      };

      $scope.domains = null;
      $scope.HOSTING_TAB_DOMAINS = HOSTING_TAB_DOMAINS;
      $scope.diagnosticSuffix = {};
      $scope.optionsForModal = {};
      $scope.sslLinked = [];
      $scope.HOSTING = HOSTING;
      $scope.HOSTING_STATUS = HOSTING_STATUS;
      $scope.CDN_STATUS = CDN_STATUS;
      $scope.CDN_VERSION = CDN_VERSION;
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

      $scope.periods = Object.values(CDN_STATISTICS_PERIOD).map((period) => ({
        label: $translate.instant(
          `hosting_multisite_statistics_period_${period}`,
        ),
        value: period,
      }));

      function sendTrackClick(hit) {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      }

      $scope.getNichandleAttachedWithFallback = function getNichandleAttachedWithFallback(
        domainName,
      ) {
        return $scope.hosting.serviceName !== domainName
          ? HostingDomain.getNichandleAttached(
              domainName,
              $scope.user.nichandle,
            )
          : $q.resolve({ isDnsAttachedToNic: true });
      };

      $scope.getZoneLinkedWithFallback = function getZoneLinkedWithFallback(
        domainName,
      ) {
        return $scope.hosting.serviceName !== domainName
          ? HostingDomain.getZoneLinked(domainName)
          : $q.resolve(domainName);
      };

      $scope.storeDiagnosticInfos = function storeDiagnosticInfos(
        domain,
        zoneLinked,
        record,
        recordType,
        nicProperties,
      ) {
        $scope.diagnosticSuffix[$scope.getKeyFor(domain.name, recordType)] =
          DIAGNOSTIC_STATE.INFO;
        $scope.optionsForModal[$scope.getKeyFor(domain.name, recordType)] = {
          ...$scope.optionsForModal[$scope.getKeyFor(domain.name, recordType)],
          zone: zoneLinked.zone,
          diagnosticState:
            $scope.diagnosticSuffix[$scope.getKeyFor(domain.name, recordType)],
          isDnsAttachedToNic: nicProperties.isDnsAttachedToNic,
        };
        $scope.optionsForModal[
          $scope.getKeyFor(domain.name, recordType)
        ].ip = record;
      };

      $scope.getRecommendIpsFor = function getRecommendIpsFor(
        recordType,
        recommendedIps,
      ) {
        const { recommendedIpV4, recommendedIpV6 } = recommendedIps;
        return recordType === HOSTING_TAB_DOMAINS.A_RECORD
          ? recommendedIpV4
          : recommendedIpV6;
      };

      $scope.fetchOptionsForModal = function fetchOptionsForModal(
        domain,
        recordType,
      ) {
        $scope.optionsForModal[$scope.getKeyFor(domain.name, recordType)] = {
          ...$scope.optionsForModal[$scope.getKeyFor(domain.name, recordType)],
          diagnosticState:
            recordType === HOSTING_TAB_DOMAINS.A_RECORD
              ? DIAGNOSTIC_STATE.ERROR
              : DIAGNOSTIC_STATE.DISABLED_GREY,
          isDnsAttachedToNic: false,
        };
      };

      $scope.getKeyFor = function getKeyFor(domainName, recordType) {
        return [domainName, recordType].join('_');
      };

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
            $scope.activeDomains = $scope.domains.list.results.filter(
              (domain) => domain.cdn === CDN_STATUS.ACTIVE,
            );
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
            return WucUser.getUser();
          })
          .then((user) => {
            $scope.user = user;

            const promises = $scope.domains.list.results.map((domain) => {
              return $q
                .all([
                  HostingDomain.getDigStatus(
                    $stateParams.productId,
                    domain.name,
                  ),
                  $scope.getZoneLinkedWithFallback(domain.name),
                  $scope.getNichandleAttachedWithFallback(domain.name),
                ])
                .then(([digStatus, zoneLinked, nicProperties]) => {
                  const isDnsExternal = Object.keys(zoneLinked).length === 0;
                  const values = {
                    ip: $scope.hosting.clusterIp,
                    domain: domain.name,
                    dns: $scope.hosting.serviceName,
                    nic: $scope.user.nichandle,
                    isDnsExternal,
                  };
                  $scope.optionsForModal[
                    $scope.getKeyFor(domain.name, HOSTING_TAB_DOMAINS.A_RECORD)
                  ] = values;
                  $scope.optionsForModal[
                    $scope.getKeyFor(
                      domain.name,
                      HOSTING_TAB_DOMAINS.AAAA_RECORD,
                    )
                  ] = values;

                  $scope.fetchOptionsForModal(
                    domain,
                    HOSTING_TAB_DOMAINS.A_RECORD,
                  );
                  $scope.fetchOptionsForModal(
                    domain,
                    HOSTING_TAB_DOMAINS.AAAA_RECORD,
                  );
                  if (isDnsExternal) {
                    return;
                  }

                  Object.keys(digStatus.records).forEach((record) => {
                    const recordType = digStatus.records[record].type;

                    $scope.storeDiagnosticInfos(
                      domain,
                      zoneLinked,
                      record,
                      recordType,
                      nicProperties,
                    );

                    if (
                      $scope
                        .getRecommendIpsFor(
                          recordType,
                          digStatus.recommendedIps,
                        )
                        .includes(record)
                    ) {
                      $scope.diagnosticSuffix[
                        $scope.getKeyFor(domain.name, recordType)
                      ] = DIAGNOSTIC_STATE.SUCCESS;
                      $scope.optionsForModal[
                        $scope.getKeyFor(domain.name, recordType)
                      ].ip = record;
                    } else {
                      $scope.diagnosticSuffix[
                        $scope.getKeyFor(domain.name, recordType)
                      ] =
                        recordType === HOSTING_TAB_DOMAINS.A_RECORD
                          ? DIAGNOSTIC_STATE.ERROR
                          : DIAGNOSTIC_STATE.DISABLED_GREY;
                      $scope.optionsForModal[
                        $scope.getKeyFor(domain.name, recordType)
                      ] = {
                        ...$scope.optionsForModal[
                          $scope.getKeyFor(domain.name, recordType)
                        ],
                        zone: zoneLinked.zone,
                        diagnosticState:
                          $scope.diagnosticSuffix[
                            $scope.getKeyFor(domain.name, recordType)
                          ],
                        isDnsAttachedToNic: nicProperties.isDnsAttachedToNic,
                      };
                    }
                  });
                });
            });
            return $q.all(promises);
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
            $scope.numberOfColumns = 6 + hosting.isCloudWeb + hosting.hasCdn;

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

      $scope.canEditCdn = function canEditCdn(domain) {
        return (
          domain.cdn === CDN_STATUS.ACTIVE &&
          domain.status !== HOSTING_STATUS.CREATING &&
          $scope.cdnProperties.version === 'cdn-hosting'
        );
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
        $state.go('app.hosting.dashboard.cdn.shared', {
          domain,
          domainName: domain.domain,
        });
      };

      $scope.settingCdnDomain = (domain) => {
        sendTrackClick('web::hosting::multisites::modify-cdn');
        $state.go('app.hosting.dashboard.cdn.shared', {
          domain,
          domainName: domain.domain,
        });
      };

      $scope.goToFlushCdn = function goToFlushCdn(domain) {
        sendTrackClick('web::hosting::multisites::purge-cdn');

        $state.go('app.hosting.dashboard.multisite.cdn-flush', {
          domain: domain.name,
        });
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

      $scope.getTooltipForDomain = function getTooltipForDomain(
        domainName,
        recordType,
      ) {
        const options =
          $scope.optionsForModal[[domainName, recordType].join('_')];
        const suffix = $scope.getDiagnosticSuffix(domainName, recordType);
        const normalizedSuffix =
          suffix === DIAGNOSTIC_STATE.DISABLED_GREY
            ? DIAGNOSTIC_STATE.ERROR
            : suffix;
        return $translate.instant(
          `hosting_tab_DOMAINS_tooltip_${
            !options ? 'error' : normalizedSuffix
          }`,
          {
            domainName,
            hosting: $scope.hosting.serviceName,
            ip: options?.ip,
          },
        );
      };

      $scope.getDiagnosticSuffix = function getDiagnosticSuffix(
        domainName,
        recordType,
      ) {
        const errorType =
          recordType === HOSTING_TAB_DOMAINS.A_RECORD
            ? DIAGNOSTIC_STATE.ERROR
            : DIAGNOSTIC_STATE.DISABLED_GREY;
        return (
          $scope.diagnosticSuffix[[domainName, recordType].join('_')] ||
          errorType
        );
      };

      $scope.getChartJsInstance = function getChartJsInstance(configuration) {
        return new ChartFactory(configuration);
      };

      $scope.openDiagnosticModal = function openDiagnosticModal(
        domain,
        recordType,
      ) {
        const suffix = $scope.getDiagnosticSuffix(domain.name, recordType);
        const options = {
          ...$scope.optionsForModal[$scope.getKeyFor(domain.name, recordType)],
          recordType,
        };
        return suffix !== DIAGNOSTIC_STATE.SUCCESS
          ? $scope.setAction('multisite/diagnostic/dialog', { options })
          : null;
      };

      $scope.resetAction = function resetAction() {
        $scope.services.navigation.resetAction();
      };

      $scope.getStatistics = function getStatistics(domain, period) {
        return $http
          .get(
            `/hosting/web/${
              $scope.hosting.serviceName
            }/cdn/domain/${domain}/statistics${
              period ? `?period=${period}` : ''
            }`,
          )
          .then(({ data }) => data);
      };

      $scope.getCdnProperties = function getCdnProperties() {
        return HostingCdnSharedService.getCDNProperties(
          $scope.hosting.serviceName,
        ).then(({ data }) => data);
      };

      startPolling();
    },
  );
