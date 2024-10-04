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
  DIAGNOSTIC_BADGE_STATE,
  DIAGNOSTIC_STATUS,
  HOSTING_OFFER,
  GIT_BADGES_STATUS,
  GIT_STATUS_WITH_TOOLTIP,
  GIT_STATUS,
  HOSTING_TAB_DOMAINS,
  RECORD_TYPE_TO_IP_TYPE,
} from './hosting-multisite.constants';
import { TRACKING_MULTISITE_PREFIX } from './git-integration/git-integration.constants';

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
      $scope.sslLinked = [];
      $scope.HOSTING = HOSTING;
      $scope.HOSTING_STATUS = HOSTING_STATUS;
      $scope.CDN_STATUS = CDN_STATUS;
      $scope.CDN_VERSION = CDN_VERSION;
      $scope.GIT_BADGES_STATUS = GIT_BADGES_STATUS;
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

      HostingDomain.getZones()
        .then((zones) => {
          $scope.listZone = zones;
        })
        .catch(() => {
          $scope.listZone = [];
        });

      function sendTrackClick(hit) {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      }

      HostingDomain.websiteCreationCapabilities(
        $scope.hosting.serviceName,
      ).then(({ allowedWebsites, existingWebsites }) => {
        $scope.allowedWebsites = allowedWebsites;
        $scope.existingWebsites = existingWebsites;
      });

      $scope.wrapperZoneInfo = function wrapperZoneInfo(domainName) {
        const rootDomain = domainName
          .split('.')
          .slice(-2)
          .join('.');

        return {
          isOVHZone: $scope.listZone.includes(rootDomain),
          zone: rootDomain,
        };
      };

      $scope.wrapperDigStatus = function wrapperDigStatus({
        records,
        recommendedIps,
      }) {
        return Object.entries(records).reduce(
          (acc, [key, { type }]) => ({
            ...acc,
            [type]: {
              ip: key,
              status: recommendedIps[
                `recommended${RECORD_TYPE_TO_IP_TYPE[type]}`
              ].includes(key),
              recommendedIps:
                recommendedIps[`recommended${RECORD_TYPE_TO_IP_TYPE[type]}`],
            },
          }),
          {},
        );
      };

      $scope.getDiagnosticBadge = function getDiagnosticBadge(
        { digStatus },
        recordType,
      ) {
        return DIAGNOSTIC_BADGE_STATE[
          $scope.diagnosticStatus(digStatus[recordType]?.status)
        ];
      };

      $scope.getDiagnosticTooltip = function getDiagnosticTooltip(
        { digStatus },
        recordType,
      ) {
        return $translate.instant(
          `hosting_tab_DOMAINS_diagnostique_tooltip_${$scope.diagnosticStatus(
            digStatus[recordType]?.status,
          )}`,
          {
            domainName: digStatus.domain,
            hosting: $scope.hosting.serviceName,
            ip: digStatus[recordType]?.ip,
          },
        );
      };

      $scope.diagnosticStatus = (status) => {
        if (typeof status === 'boolean') {
          return status
            ? DIAGNOSTIC_STATUS.GOOD_CONFIGURATION
            : DIAGNOSTIC_STATUS.NOT_GOOD_CONFIGURATION;
        }
        return DIAGNOSTIC_STATUS.UNCONFIGURED;
      };

      $scope.openDiagnosticModal = function openDiagnosticModal(
        { digStatus },
        recordType,
      ) {
        return (
          !digStatus[recordType]?.status &&
          $scope.setAction('multisite/diagnostic/dialog', {
            digStatus,
            recordType,
          })
        );
      };

      function isMainDomain(hosting, domain) {
        return ['ovh.net', 'hosting.ovh.net']
          .map(
            (suffix) => `${hosting.primaryLogin}.${hosting.cluster}.${suffix}`,
          )
          .some((mainDomain) => mainDomain === domain.name);
      }

      $scope.isUpdateDomainDisabled = function isUpdateDomainDisabled(
        hosting,
        domain,
      ) {
        return (
          domain.status === HOSTING_STATUS.UPDATING ||
          isMainDomain(hosting, domain)
        );
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
          })
          .then(() =>
            $q.all(
              $scope.domains.list.results.map((domain) =>
                $q
                  .all([
                    HostingDomain.getDigStatus(
                      $stateParams.productId,
                      domain.name,
                    ),
                    $scope.wrapperZoneInfo(domain.name),
                  ])
                  .then(([digStatus, zoneInfo]) => ({
                    ...$scope.wrapperDigStatus(digStatus),
                    domain: domain.name,
                    ...zoneInfo,
                  })),
              ),
            ),
          )
          .then((digStatus) => {
            $scope.domains.list.results = $scope.domains.list.results.map(
              (domain) => ({
                ...domain,
                digStatus: digStatus.find(
                  ({ domain: digDomain }) => domain.name === digDomain,
                ),
              }),
            );

            return hostingSSLCertificate.retrievingLinkedDomains(
              $stateParams.productId,
            );
          })
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

      $scope.gitStatusTooltip = function gitStatusTooltip({ vcsStatus }) {
        const allowedWebsites =
          $scope.allowedWebsites === -1 ? 'unlimitedPath' : 'limitedPath';
        return GIT_STATUS_WITH_TOOLTIP[allowedWebsites][vcsStatus]
          ? $translate.instant(
              `hosting_tab_DOMAINS_table_git_state_tooltip_${GIT_STATUS_WITH_TOOLTIP[allowedWebsites][vcsStatus]}`,
            )
          : '';
      };

      $scope.canAssociateGit = function canAssociateGit({ vcsStatus }) {
        return (
          ($scope.existingWebsites < $scope.allowedWebsites ||
            $scope.allowedWebsites === -1 ||
            vcsStatus === GIT_STATUS.initialError) &&
          !$scope.canConfigureGit({ vcsStatus }) &&
          vcsStatus !== GIT_STATUS.creating
        );
      };

      $scope.canConfigureGit = function canConfigureGit({ vcsStatus }) {
        return [
          GIT_STATUS.created,
          GIT_STATUS.error,
          GIT_STATUS.deploying,
        ].includes(vcsStatus);
      };

      $scope.canDeployGit = function canDeployGit({ vcsStatus }) {
        return [GIT_STATUS.created, GIT_STATUS.error].includes(vcsStatus);
      };

      $scope.canViewLastDeploymentGit = function canViewLastDeploymentGit({
        vcsStatus,
      }) {
        return [
          GIT_STATUS.created,
          GIT_STATUS.error,
          GIT_STATUS.initialError,
          GIT_STATUS.deploying,
          GIT_STATUS.deleting,
        ].includes(vcsStatus);
      };

      $scope.canDeleteGit = function canDeleteGit({ vcsStatus }) {
        return [
          GIT_STATUS.initialError,
          GIT_STATUS.created,
          GIT_STATUS.error,
          GIT_STATUS.deploying,
        ].includes(vcsStatus);
      };

      $scope.hasDoingGitAction = function hasDoingGitAction({ vcsStatus }) {
        return [
          GIT_STATUS.creating,
          GIT_STATUS.deleting,
          GIT_STATUS.deploying,
        ].includes(vcsStatus);
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

      $scope.goToRemoveRepository = (domain) => {
        sendTrackClick(`${TRACKING_MULTISITE_PREFIX}::git-removal`);
        $scope.$resolve.goToRemoveRepository(
          $scope.hosting.serviceName,
          domain.path,
        );
      };

      $scope.goToAssociateRepository = (domain) => {
        sendTrackClick(`${TRACKING_MULTISITE_PREFIX}::add-git`);
        $scope.$resolve.goToAssociateRepository(
          $scope.hosting.serviceName,
          domain,
        );
      };

      $scope.goToConfigureGit = (domain) =>
        $scope.$resolve.goToConfigureGit($scope.hosting.serviceName, domain);

      $scope.goToDeployWebSite = (domain) => {
        sendTrackClick(`${TRACKING_MULTISITE_PREFIX}::git-deployment`);
        return $scope.$resolve.goToDeployWebSite(
          $scope.hosting.serviceName,
          domain,
        );
      };

      $scope.goToViewLastDeploy = (domain) => {
        sendTrackClick(
          `${TRACKING_MULTISITE_PREFIX}::git-view-last-deployment`,
        );
        return $scope.$resolve.goToViewLastDeploy(
          $scope.hosting.serviceName,
          domain,
        );
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

      $scope.getChartJsInstance = function getChartJsInstance(configuration) {
        return new ChartFactory(configuration);
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
