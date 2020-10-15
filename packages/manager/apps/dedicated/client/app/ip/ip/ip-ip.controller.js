import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import set from 'lodash/set';
import toInteger from 'lodash/toInteger';

angular
  .module('Module.ip.controllers')
  .controller(
    'IpDashboardCtrl',
    (
      $http,
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

      // pagination
      $scope.pageNumber = toInteger($stateParams.page) || 1;
      $scope.pageSize = toInteger($stateParams.pageSize) || 1;
      $scope.paginationOffset = 1 + ($scope.pageNumber - 1) * $scope.pageSize;
      if ($scope.pageNumber < 1) {
        $scope.pageNumber = 1;
      }
      if ($scope.pageSize < 10) {
        $scope.pageSize = 10;
      } else if ($scope.pageSize > 300) {
        $scope.pageSize = 300;
      }

      $http
        .get('/sws/products/services', {
          serviceType: 'aapi',
        })
        .then(({ data }) => data)
        .then((services) => {
          $scope.services = [
            {
              category: 'OTHER',
              serviceName: '_ALL',
            },
            {
              category: 'OTHER',
              serviceName: '_PARK',
            },
            {
              category: 'OTHER',
              serviceName: '_FAILOVER',
            },
            ...orderBy(services, 'serviceName'),
          ];
          $scope.selectedService = find($scope.services, {
            serviceName: $scope.serviceName,
          });
        });

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
        $scope.selectedService = null;
        $scope.serviceName = $stateParams.serviceName || '_ALL';
      }

      $scope.canImportIPFO = () =>
        ipFeatureAvailability.allowIPFailoverImport();
      $scope.canOrderIPFO = () => ipFeatureAvailability.allowIPFailoverOrder();
      $scope.canOrderAgoraIPFO = () =>
        ipFeatureAvailability.allowIPFailoverAgoraOrder();

      $scope.singleService = () =>
        $scope.serviceName !== '_ALL' && $scope.serviceName !== 'FAILOVER';

      Ip.getPriceForParking().then((price) => {
        $scope.parkPrice = price;
      });

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

      function refreshIp(ip) {
        return $http
          .get('/ips', {
            params: {
              extras: true,
              ip,
            },
            serviceType: 'aapi',
          })
          .then(({ data }) => data)
          .then(({ count, data }) => {
            return count === 1 ? data[0] : null;
          });
      }

      function refreshAlerts(ips) {
        $scope.loading.alerts = true;
        const params = {
          extras: true,
          pageSize: 5000,
        };
        const ipsPromise = ips
          ? $q.when(ips)
          : $http
              .get('/ips', {
                params,
                serviceType: 'aapi',
              })
              .then(({ data }) => data.data);
        $scope.alerts = {
          mitigation: [],
          antihack: [],
          arp: [],
          spam: [],
        };
        if ($scope.serviceName && $scope.serviceName !== '_ALL') {
          params.serviceName = $scope.serviceName;
        }
        return ipsPromise
          .then((ipList) => {
            ipList.forEach((ip) => {
              ip.alerts.antihack.forEach((alert) =>
                $scope.alerts.antihack.push({ ip, alert }),
              );
              ip.alerts.mitigation.forEach((alert) =>
                $scope.alerts.mitigation.push({ ip, alert }),
              );
              ip.alerts.arp.forEach((alert) =>
                $scope.alerts.arp.push({ ip, alert }),
              );
              ip.alerts.spam.forEach((alert) =>
                $scope.alerts.spam.push({ ip, alert }),
              );
            });
          })
          .finally(() => {
            $scope.loading.alerts = false;
          });
      }

      function refreshTable() {
        const params = {
          extras: true,
          pageSize: $scope.pageSize,
          pageNumber: $scope.pageNumber,
        };
        $scope.loading.table = true;
        $scope.ipsList = [];
        if ($scope.serviceName === '_FAILOVER') {
          params.type = 'failover';
        } else if ($scope.serviceName === '_PARK') {
          params.type = 'failover';
          params.pageSize = 5000;
          params.pageNumber = 1;
          $location.search('page', undefined);
          $location.search('pageSize', undefined);
        } else if ($scope.serviceName && $scope.serviceName !== '_ALL') {
          params.serviceName = $scope.serviceName;
        }
        return $http
          .get('/ips', {
            params,
            serviceType: 'aapi',
          })
          .then(({ data }) => data)
          .then(({ count, data }) => {
            $scope.ipsCount = count;
            $scope.ipsList = map(data, (ip) => {
              return {
                ...ip,
                collapsed: !ip.isUniq,
                service: {
                  serviceName: get(ip, 'routedTo.serviceName'),
                  category: ip.type,
                },
              };
            });
            if ($scope.serviceName === '_PARK') {
              $scope.ipsList = filter(
                $scope.ipsList,
                (ip) => !get(ip, 'routedTo.serviceName'),
              );
              $scope.ipsList = map($scope.ipsList, (ip) => ({
                ...ip,
                routedTo: {
                  serviceName: '_PARK',
                },
              }));
            }
            $scope.ipsList.forEach(checkIps);
            refreshAlerts(
              count === $scope.ipsList.length || $scope.serviceName === '_PARK'
                ? data
                : null,
            );
          })
          .finally(() => {
            $scope.loading.table = false;
          });
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

      $scope.onPaginationChange = ({ offset, pageSize }) => {
        $scope.pageSize = pageSize;
        $scope.pageNumber = 1 + Math.floor((offset - 1) / pageSize);
        $scope.paginationOffset = 1 + ($scope.pageNumber - 1) * $scope.pageSize;
        $location.search('page', $scope.pageNumber);
        $location.search('pageSize', $scope.pageSize);
        refreshTable();
      };

      $scope.selectService = ({ serviceName }) => {
        $scope.pageNumber = 1;
        $scope.serviceName = serviceName;
        $location.search('page', $scope.pageNumber);
        $location.search('serviceName', serviceName);
        refreshTable();
      };

      function pollVirtualMacs(service) {
        IpVirtualMac.pollVirtualMacs(service).then((vmacInfos) => {
          set(service, 'virtualmac', vmacInfos);
        });
      }

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
          get(ipBlock, 'routedTo.serviceName'),
          ipBlock.type,
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

      $scope.$on('ips.table.refreshBlock', (e, ip) => {
        set(ip, 'refreshing', true);
        if (ip.isUniq) {
          return refreshIp(ip.ipBlock).then((refreshedIp) => {
            Object.assign(ip, refreshedIp);
            checkIps(ip);
            set(ip, 'refreshing', false);
          });
        }
        return Ip.getIpsForIpBlock(
          ip.ipBlock,
          ip.service.serviceName,
          ip.service.category,
        ).then((ips) => {
          set(ip, 'ips', ips);
          checkIps(ip);
          set(ip, 'refreshing', false);
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
        refreshTable();
      });

      $scope.$on('organisation.change.done', () => {
        init();
        refreshTable();
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
      $scope.getStatePercent = function getStatePercent() {
        return Math.ceil(($scope.state.loaded / $scope.state.total) * 100);
      };
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
        refreshTable();
      }
    },
  );
