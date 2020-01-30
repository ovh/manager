import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';
import values from 'lodash/values';

angular
  .module('Module.ip.controllers')
  .controller(
    'IpDashboardCtrl',
    (
      $location,
      $q,
      $rootScope,
      $scope,
      $stateParams,
      $timeout,
      $translate,
      Alerter,
      Ip,
      ipFeatureAvailability,
      IpFirewall,
      IpMitigation,
      IpOrganisation,
      IpReverse,
      IpVirtualMac,
      Validator,
    ) => {
      $scope.currentView = 'table';
      $scope.containsAllServices = false;
      $scope.getAll = false;

      /* Init */

      function init() {
        $scope.alerts = {
          mitigation: [],
          antihack: [],
          arp: [],
          spam: [],
        };

        $scope.loading = {};
        $scope.state = {};

        $scope.services = [];

        $scope.filters = {
          service: {},
        };
      }

      $scope.loaders = {
        reverseDelegations: false,
      };

      $scope.canImportIPFO = () =>
        ipFeatureAvailability.allowIPFailoverImport();
      $scope.canOrderIPFO = () => ipFeatureAvailability.allowIPFailoverOrder();
      $scope.canOrderAgoraIPFO = () =>
        ipFeatureAvailability.allowIPFailoverAgoraOrder();

      $scope.canReverseDelegations = function canReverseDelegations(ipBlock) {
        return (
          ipBlock.version === 'IPV6' && /(\/64|\/56)$/.test(ipBlock.ipBlock)
        );
      };

      $scope.getReverseDelegations = function getReverseDelegations(ipBlock) {
        set(ipBlock, 'reverseDelegationsRefresh', true);
        return IpReverse.getDelegations(ipBlock.ipBlock)
          .then((reverseDelegations) => {
            set(ipBlock, 'reverseDelegations', reverseDelegations);
          })
          .catch((err) => {
            set(ipBlock, 'reverseDelegationsErr', err);
          })
          .finally(() => {
            set(ipBlock, 'reverseDelegationsRefresh', false);
          });
      };

      function sortIp(a, b) {
        if (a.version === 'IPV4') {
          const aa = a.ipBlock.replace(/\/\d+$/, '').split('.');
          const bb = b.ipBlock.replace(/\/\d+$/, '').split('.');

          const resulta =
            aa[0] * 0x1000000 + aa[1] * 0x10000 + aa[2] * 0x100 + aa[3];
          const resultb =
            bb[0] * 0x1000000 + bb[1] * 0x10000 + bb[2] * 0x100 + bb[3];

          return resulta - resultb;
        }
        return 0;
      }

      function loadDashboard() {
        $scope.loading.init = true;
        $scope.ipsList = [];

        Ip.getPriceForParking().then((price) => {
          $scope.parkPrice = price;
        });

        Ip.getServicesList()
          .then((services) => {
            // Get only trusted services, and sort them
            $scope.services = services;

            // Add others to the list of services
            $scope.services.unshift(
              {
                category: 'OTHER',
                serviceName: '_ALL',
              },
              {
                category: 'OTHER',
                serviceName: '_PARK',
              },
            );

            // Select service "ALL" by default
            $scope.filters.service = head($scope.services);

            // If serviceName in URL param
            if ($stateParams.serviceName) {
              const selectedService = find($scope.services, {
                serviceName: $stateParams.serviceName,
              });
              if (selectedService) {
                $scope.filters.service = selectedService;
              }
            }

            $scope.selectService();
          })
          .finally(() => {
            $scope.loading.init = false;
          });
      }

      function checkIps(ipBlock) {
        if (!(ipBlock.ips && ipBlock.ips.length)) {
          return;
        }

        // Refresh alerts for this ipBlock
        set(ipBlock, 'alerts', {
          mitigation: [],
          antihack: [],
          arp: [],
          spam: [],
        });

        angular.forEach(ipBlock.ips, (ip) => {
          // Stop all pending polling for this ipBlock/ip
          IpFirewall.killPollFirewallState(ipBlock, ip);
          // Stop all pending polling for this ipBlock/ip
          IpMitigation.killPollMitigationState(ipBlock, ip);

          // Poll mitigation state
          if (
            ip.mitigation === 'CREATION_PENDING' ||
            ip.mitigation === 'REMOVAL_PENDING'
          ) {
            IpMitigation.pollMitigationState(ipBlock, ip).then(() => {
              Ip.getIpsForIpBlock(
                ipBlock.ipBlock,
                ipBlock.service.serviceName,
                ipBlock.service.category,
              ).then((ips) => {
                const newIp = find(ips, { ip: ip.ip });
                angular.extend(ip, newIp);
              });
            });
          }

          // Poll firewall state
          if (
            ip.firewall === 'ENABLE_PENDING' ||
            ip.firewall === 'DISABLE_PENDING'
          ) {
            IpFirewall.pollFirewallState(ipBlock, ip).then(() => {
              Ip.getIpsForIpBlock(
                ipBlock.ipBlock,
                ipBlock.service.serviceName,
                ipBlock.service.category,
              ).then((ips) => {
                const newIp = find(ips, { ip: ip.ip });
                angular.extend(ip, newIp);
              });
            });
          }

          // Alerts
          if (ip.spam === 'BLOCKED_FOR_SPAM') {
            ipBlock.alerts.spam.push(ip.ip);
          }
          if (ip.antihack === 'BLOCKED') {
            ipBlock.alerts.antihack.push(ip.ip);
          }
          if (ip.arp === 'BLOCKED') {
            ipBlock.alerts.arp.push(ip.ip);
          }
          if (ip.mitigation === 'FORCED') {
            ipBlock.alerts.mitigation.push(ip.ip);
          }
        });
      }

      function checkCloudIpSubtype(ipBlock) {
        const isCloud =
          ipBlock && ipBlock.service && ipBlock.service.category === 'CLOUD';
        const isFailover = ipBlock && ipBlock.type === 'FAILOVER';

        if (isCloud && isFailover && ipBlock.ips && ipBlock.ips.length) {
          // since ips have the same subType in a given ipBlock,
          // we are only checking the subType of the first IP to guess the block subType
          return Ip.getCloudIpSubType(
            ipBlock.service.serviceName,
            head(ipBlock.ips).ip,
          ).then((subType) => {
            set(ipBlock, 'subType', subType);
          });
        }
        return $q.when();
      }

      function pollVirtualMacs(service) {
        IpVirtualMac.pollVirtualMacs(service).then((vmacInfos) => {
          set(service, 'virtualmac', vmacInfos);
        });
      }

      function loadService(service) {
        set(service, 'loading', {});
        set(service, 'detailsLoaded', false);

        return Ip.getIpsListForService(service.serviceName).then(
          (_ipBlocks) => {
            let ipBlocks = _ipBlocks;

            if (!ipBlocks) {
              return null;
            }

            angular.forEach(ipBlocks, (ipBlock) => {
              // Add service pointer to each ipBlock
              set(ipBlock, 'service', service);

              // Sanitize IPs
              checkIps(ipBlock);
            });

            ipBlocks = ipBlocks.sort(sortIp);

            const reverseDelegationPromise = $q.all(
              values(
                map(
                  filter(ipBlocks, $scope.canReverseDelegations),
                  $scope.getReverseDelegations,
                ),
              ),
            );

            let virtualMacPromise = $q.when();

            const cloudIpSubTypePromise = $q.all(
              ipBlocks.map(checkCloudIpSubtype),
            );

            // if service DEDICATED: get vmacs
            if (service.category === 'DEDICATED') {
              set(service, 'loading.virtualmac', true);
              virtualMacPromise = IpVirtualMac.getVirtualMacList(service)
                .then((vmacInfos) => {
                  set(service, 'virtualmac', vmacInfos);

                  if (vmacInfos && vmacInfos.status === 'PENDING') {
                    pollVirtualMacs(service);
                  }
                })
                .finally(() => {
                  set(service, 'loading.virtualmac', false);
                });
            }

            $q.all([
              reverseDelegationPromise,
              virtualMacPromise,
              cloudIpSubTypePromise,
            ]).then(() => {
              set(service, 'detailsLoaded', true);
            });

            return ipBlocks;
          },
        );
      }

      $scope.getVirtualMacMessage = function getVirtualMacMessage(ipBlock) {
        if (ipBlock.service && ipBlock.service.category) {
          if (ipBlock.service.category !== 'DEDICATED') {
            return $translate.instant('ip_virtualmac_add_impossible_server');
          }

          if (ipBlock.service.virtualmac.status === 'PENDING') {
            return $translate.instant('ip_virtualmac_add_impossible_status');
          }

          if (ipBlock.service.virtualmac.status === 'OK') {
            return $translate.instant('ip_virtualmac_add_impossible_exists');
          }
          return $translate.instant('ip_virtualmac_add_impossible_unavailable');
        }

        return null;
      };

      function killAllPolling() {
        Ip.killAllGetIpsListForService();
        IpVirtualMac.killPollVirtualMacs();
        IpFirewall.killPollFirewallState();
        IpMitigation.killPollMitigationState();
        IpOrganisation.killAllPolling();
      }

      function refreshAlerts() {
        $scope.alerts = {
          mitigation: [],
          antihack: [],
          arp: [],
          spam: [],
        };
        angular.forEach($scope.ipsList, (ipBlock) => {
          if (ipBlock.alerts) {
            if (ipBlock.alerts.spam && ipBlock.alerts.spam.length) {
              $scope.alerts.spam = $scope.alerts.spam.concat(
                ipBlock.alerts.spam,
              );
            }
            if (ipBlock.alerts.antihack && ipBlock.alerts.antihack.length) {
              $scope.alerts.antihack = $scope.alerts.antihack.concat(
                ipBlock.alerts.antihack,
              );
            }
            if (ipBlock.alerts.arp && ipBlock.alerts.arp.length) {
              $scope.alerts.arp = $scope.alerts.arp.concat(ipBlock.alerts.arp);
            }
            if (ipBlock.alerts.mitigation && ipBlock.alerts.mitigation.length) {
              $scope.alerts.mitigation = $scope.alerts.mitigation.concat(
                ipBlock.alerts.mitigation,
              );
            }
          }
        });
      }

      // If service selected: load only this service,
      // else, load all of them
      let mainQueue;
      $scope.selectService = function selectService() {
        killAllPolling();

        $scope.getAll = $scope.state.total === $scope.state.loaded;

        $q.when(mainQueue)
          .then(() => {
            // We already have all services loaded, filter to select the one desired.
            if (
              $scope.containsAllServices &&
              get($scope, 'filters.service.serviceName') === 'ALL'
            ) {
              $scope.ipsList = filter($scope.allIpsList, {
                routedTo: $scope.filters.service.serviceName,
              });
              return null;
            }

            let queue = [];
            $scope.ipsList = [];
            $scope.servicesInError = [];
            $scope.state.loaded = 0;
            $scope.loading.table = true;

            if (
              $scope.filters.service &&
              $scope.filters.service.serviceName === '_ALL'
            ) {
              $scope.state.total = $scope.services.length - 1; // -1 = "_ALL"

              queue = $scope.services.map((service) => {
                if (service.serviceName !== '_ALL') {
                  return loadService(service)
                    .then((ipBlocks) => {
                      $scope.ipsList = $scope.ipsList.concat(ipBlocks);
                    })
                    .catch(() => {
                      $scope.servicesInError.push(service.serviceName);
                    })
                    .finally(() => {
                      $scope.state.loaded += 1;
                    });
                }
                return null;
              });
            } else {
              $scope.state.total = 1;
              queue.push(
                loadService($scope.filters.service)
                  .then((ipBlocks) => {
                    $scope.ipsList = $scope.ipsList.concat(ipBlocks);
                  })
                  .catch(() => {
                    $scope.servicesInError.push(
                      $scope.filters.service.serviceName,
                    );
                  })
                  .finally(() => {
                    $scope.state.loaded += 1;
                  }),
              );
            }

            mainQueue = $q.all(queue).then(() => {
              if ($scope.servicesInError.length) {
                Alerter.error(
                  $translate.instant('ip_services_error', {
                    t0: $scope.servicesInError.join(', '),
                  }),
                );
              }
              $scope.containsAllServices =
                $scope.getAll && $scope.filters.service.serviceName === '_ALL';
            });

            return mainQueue;
          })
          .finally(() => {
            $scope.loading.table = false;
            refreshAlerts();
          });
      };

      $scope.alertsCount = function alertsCount(ipBlock) {
        if (ipBlock) {
          return (
            ipBlock.alerts.spam.length +
            ipBlock.alerts.antihack.length +
            ipBlock.alerts.arp.length +
            ipBlock.alerts.mitigation.length
          );
        }
        return (
          $scope.alerts.spam.length +
          $scope.alerts.antihack.length +
          $scope.alerts.arp.length +
          $scope.alerts.mitigation.length
        );
      };

      $scope.alertsTooltip = function alertsTooltip(ipBlock) {
        const spam = $translate
          .instant('ip_alerts_spam_other')
          .replace('{}', ipBlock.alerts.spam.length);
        const hack = $translate
          .instant('ip_alerts_antihack_other')
          .replace('{}', ipBlock.alerts.antihack.length);
        const arp = $translate
          .instant('ip_alerts_arp_other')
          .replace('{}', ipBlock.alerts.arp.length);
        const mitigation = $translate
          .instant('ip_alerts_mitigation_other')
          .replace('{}', ipBlock.alerts.mitigation.length);
        return `${spam}, ${hack}, ${arp}, ${mitigation}`;
      };

      // Return a promise !
      // 'forceOpen' param is optional
      $scope.toggleIp = function toggleIp(ipBlock, forceOpen) {
        if (ipBlock.loading) {
          // If loading, do nothing
          return $q.when(true);
        }
        if (ipBlock.loaded) {
          // If loaded and not loading, just toggle
          return $q.when(true).then(() => {
            set(ipBlock, 'collapsed', forceOpen ? false : !ipBlock.collapsed);
          });
        }

        // Else, get it
        set(ipBlock, 'loading', true);
        return Ip.getIpsForIpBlock(
          ipBlock.ipBlock,
          ipBlock.service.serviceName,
          ipBlock.service.category,
        )
          .then((data) => {
            set(ipBlock, 'ips', data);
            checkIps(ipBlock);
            set(ipBlock, 'collapsed', false);
            set(ipBlock, 'loaded', true);
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('ip_service_error', { t0: ipBlock.ipBlock }),
              err.data,
            );
          })
          .finally(() => {
            set(ipBlock, 'loading', false);
          });
      };

      $scope.$on('$destroy', () => {
        killAllPolling();
      });

      // ---

      $scope.$on('ips.table.refreshBlock', (e, ipBlock) => {
        set(ipBlock, 'refreshing', true);
        if ($scope.canReverseDelegations(ipBlock)) {
          $scope.getReverseDelegations(ipBlock);
        }

        const isUniqueIp = ipBlock.isUniq;
        const updateReversePromise = isUniqueIp
          ? loadService(ipBlock.service)
          : Ip.getIpsForIpBlock(
              ipBlock.ipBlock,
              ipBlock.service.serviceName,
              ipBlock.service.category,
            );

        return updateReversePromise.then((serviceIpBlock) => {
          if (isUniqueIp) {
            const updatedIpBlock = find(serviceIpBlock, {
              ipBlock: ipBlock.ipBlock,
            });

            set(ipBlock, 'ips', updatedIpBlock.ips);
          } else {
            set(ipBlock, 'ips', serviceIpBlock);
          }

          checkIps(ipBlock);
          set(ipBlock, 'refreshing', false);
        });
      });

      $scope.$on('ips.table.refreshVmac', (e, ipBlock) => {
        if (ipBlock.service.category === 'DEDICATED') {
          set(ipBlock, 'service.loading.virtualmac', true);
          IpVirtualMac.getVirtualMacList(ipBlock.service)
            .then((vmacInfos) => {
              set(ipBlock, 'service.virtualmac', vmacInfos);

              if (vmacInfos && vmacInfos.status === 'PENDING') {
                pollVirtualMacs(ipBlock.service);
              }
            })
            .finally(() => {
              set(ipBlock, 'service.loading.virtualmac', false);
            });
        }
      });

      // Add only an Ipv6
      $scope.$on('ips.table.add', (e, ipBlock, ipv6) => {
        // Ensure ipBlock is loaded and opened
        $scope.toggleIp(ipBlock, true).then(() => {
          if (!find(ipBlock.ips, { ip: ipv6 })) {
            // Skip if ip already present
            ipBlock.ips.push({
              ip: ipv6,
              reverse: null,
              mitigation: 'DEFAULT',
              firewall: 'NOT_CONFIGURED',
            });
          }
        });
      });

      // used by antispam view
      $scope.$on('ips.table.reload', () => {
        init();
        loadDashboard();
      });

      $scope.$on('organisation.change.done', () => {
        init();
        loadDashboard();
        Alerter.success(
          $translate.instant('ip_organisation_change_organisations_done'),
        );
      });

      // Views switch
      $scope.$on('ips.display', (e, selectedView) => {
        $scope.currentView = selectedView;
        if (selectedView === 'organisation') {
          $scope.displayOrganisation();
        }
      });
      $scope.displayAntispam = function displayAntispam(ipBlock, ip) {
        $scope.currentView = 'antispam';
        $rootScope.$broadcast('ips.antispam.display', {
          ip: ipBlock.ipBlock,
          ipSpamming: ip.ip,
        });
      };
      $scope.displayFirewall = function displayFirewall(ipBlock, ip) {
        $scope.currentView = 'firewall';
        $scope.$broadcast('ips.firewall.display', { ipBlock, ip });
      };
      $scope.displayGameFirewall = function displayGameFirewall(ipBlock, ip) {
        $scope.currentView = 'gameFirewall';
        $scope.$broadcast('ips.gameFirewall.display', { ipBlock, ip });
      };
      $scope.displayOrganisation = function displayOrganisation() {
        $scope.currentView = 'organisation';
        $scope.$broadcast('ips.organisation.display');
      };

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

      $scope.getStatePercent = function getStatePercent() {
        return Math.ceil(($scope.state.loaded / $scope.state.total) * 100);
      };

      /*= =========  Reverse inline  ========== */

      $scope.reverseIsValid = function reverseIsValid(reverse) {
        return (
          !reverse ||
          (reverse && Validator.isValidDomain(reverse.replace(/\.$/, '')))
        );
      };
      $scope.editReverseInline = function editReverseInline(ipBlock, ip) {
        if (ip.reverseEdit === true) {
          return;
        }
        set(
          ip,
          'reverseEditValue',
          angular.copy(ip.reverse ? punycode.toUnicode(ip.reverse) : ''),
        );
        set(ip, 'reverseEdit', true);
      };
      $scope.editReverseInlineApply = function editReverseInlineApply(
        ipBlock,
        ip,
        e,
      ) {
        e.stopPropagation();
        set(ipBlock, 'refreshing', true);
        IpReverse.updateReverse(ipBlock, ip.ip, ip.reverseEditValue).then(
          () => {
            $rootScope.$broadcast('ips.table.refreshBlock', ipBlock);
            Alerter.success(
              $translate.instant('ip_table_manage_reverse_success'),
            );
          },
          (data) => {
            set(ipBlock, 'refreshing', false);
            Alerter.alertFromSWS(
              $translate.instant('ip_table_manage_reverse_failure'),
              data,
            );
          },
        );
      };
      $scope.editReverseInlineCancel = function editReverseInlineCancel(
        ipBlock,
        ip,
        e,
      ) {
        e.stopPropagation();
        set(ip, 'reverseEdit', false);
      };

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

      init();

      if (
        $location.search().action === 'toggleFirewall' &&
        $location.search().ip
      ) {
        $timeout(() => {
          $scope.setAction('ip/firewall/toggle/ip-ip-firewall-toggle', {
            ipBlock: $location.search().ipBlock,
            ip: $location.search().ip,
          });
        }, 300);
      }
      if ($location.search().action === 'mitigation' && $location.search().ip) {
        $timeout(() => {
          $scope.setAction('ip/mitigation/update/ip-ip-mitigation-update', {
            ipBlock: $location.search().ipBlock,
            ip: $location.search().ip,
          });
        }, 300);
      }
      if ($location.search().action === 'reverse' && $location.search().ip) {
        $timeout(() => {
          $scope.setAction('ip/reverse/update/ip-ip-reverse-update', {
            ipBlock: $location.search().ipBlock,
            ip: $location.search().ip,
          });
        }, 300);
      }
      if ($location.search().action === 'firewall' && $location.search().ip) {
        $scope.currentView = 'firewall';
      }
      if (
        $location.search().action === 'antispam' &&
        $location.search().ip &&
        $location.search().ipSpamming
      ) {
        $scope.currentView = 'antispam';
      } else {
        // Init the magic
        loadDashboard();
      }
    },
  );
