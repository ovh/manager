import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import toInteger from 'lodash/toInteger';

import {
  IP_TYPE,
  TRACKING_PREFIX,
  BADGE_BYOIP,
  BADGE_FO,
  BADGES,
} from './list.constant';

export default class IpListController {
  /* @ngInject */
  constructor(
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
    IpFirewall,
    IpMitigation,
    IpOrganisation,
    IpReverse,
    IpVirtualMac,
    Validator,
    atInternet,
    ipFeatureAvailability,
  ) {
    this.$http = $http;
    this.$location = $location;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Ip = Ip;
    this.IpFirewall = IpFirewall;
    this.IpMitigation = IpMitigation;
    this.IpOrganisation = IpOrganisation;
    this.IpReverse = IpReverse;
    this.IpVirtualMac = IpVirtualMac;
    this.Validator = Validator;
    this.atInternet = atInternet;
    this.ipFeatureAvailability = ipFeatureAvailability;
  }

  $onInit() {
    const self = this;
    const {
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
      IpFirewall,
      IpMitigation,
      IpOrganisation,
      IpReverse,
      IpVirtualMac,
      Validator,
      atInternet,
      ipFeatureAvailability,
    } = this;

    $scope.alerts = {
      mitigation: [],
      antihack: [],
      arp: [],
      spam: [],
    };
    $scope.IP_TYPE = IP_TYPE;
    $scope.showBYOIPBadge = (self.badges || BADGES).includes(BADGE_BYOIP);
    $scope.showFOBadge = (self.badges || BADGES).includes(BADGE_FO);

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

    function init() {
      $scope.loading = {};
      $scope.state = {};
      $scope.serviceType =
        self.serviceType || $location.search().serviceType || null;
      $scope.serviceCategory = {};
      $scope.tracking = {
        'enable-permanent-mitigation': `${TRACKING_PREFIX}::enable-permanent-mitigation`,
        'create-firewall': `${TRACKING_PREFIX}::create-firewall`,
        'enable-firewall': `${TRACKING_PREFIX}::enable-firewall`,
        'ip-firewall': `${TRACKING_PREFIX}::ip::firewall`,
        'disable-firewall': `${TRACKING_PREFIX}::disable-firewall`,
        'mac-add': `${TRACKING_PREFIX}::mac-add`,
        statistics: `${TRACKING_PREFIX}::statistics`,
        'switch-auto-mitigation': `${TRACKING_PREFIX}::switch-auto-mitigation`,
        'move-failover': `${TRACKING_PREFIX}::move-failover`,
        'delete-failover': `${TRACKING_PREFIX}::delete-failover`,
        'mac-details': `${TRACKING_PREFIX}::mac-details`,
        'mac-delete': `${TRACKING_PREFIX}::mac-delete`,
        'ip-firewall-add-rule': `${TRACKING_PREFIX}::ip::firewall::add-rule`,
        'ip-firewall-delete-rule': `${TRACKING_PREFIX}::ip::firewall::delete-rule`,
      };
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

    function checkIps(ipBlock) {
      // Refresh alerts for this ipBlock
      set(ipBlock, 'alerts', {
        mitigation: [],
        antihack: [],
        arp: [],
        spam: [],
      });

      if (!(ipBlock.ips && ipBlock.ips.length)) {
        return;
      }

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

        // Poll virtual mac
        if (get(ipBlock, 'virtualMac.status') === 'PENDING') {
          IpVirtualMac.pollVirtualMacs(ipBlock.service).then(() => {
            refreshIp(ipBlock.ipBlock).then((refreshedIp) => {
              Object.assign(ipBlock, refreshedIp);
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

    function refreshAlerts(ips) {
      $scope.loading.alerts = true;
      $scope.alerts = {
        mitigation: [],
        antihack: [],
        arp: [],
        spam: [],
      };
      return Ip.fetchAlerts({ ips, serviceType: $scope.serviceType })
        .then((alerts) => {
          $scope.alerts = alerts;
        })
        .finally(() => {
          $scope.loading.alerts = false;
        });
    }

    function refreshTable() {
      const params = {
        ...$scope.params,
        extras: true,
        pageSize: $scope.pageSize,
        pageNumber: $scope.pageNumber,
      };
      $scope.loading.table = true;
      $scope.ipsList = [];
      if ($scope.serviceType) {
        params.type = $scope.serviceType;
      }
      return $http
        .get('/sws/products/services', {
          serviceType: 'aapi',
        })
        .then(({ data: services }) => {
          $scope.serviceCategory = {};
          services.forEach(({ category, serviceName }) => {
            $scope.serviceCategory[serviceName] = category;
          });
          return $http.get('/ips', {
            params,
            serviceType: 'aapi',
          });
        })
        .then(({ data: { count, data } }) => {
          $scope.ipsCount = count;
          $scope.ipsList = map(data, (ip) => {
            const serviceName = get(ip, 'routedTo.serviceName');
            return {
              ...ip,
              collapsed: !ip.isUniq,
              service: {
                serviceName,
                category: $scope.serviceCategory[serviceName],
              },
            };
          });
          // ??
          if ($scope.serviceName === '_PARK') {
            $scope.ipsList = filter(
              $scope.ipsList,
              (ip) => !get(ip, 'routedTo.serviceName'),
            );
          }
          $scope.ipsList.forEach(checkIps);
        })
        .catch((error) => {
          Alerter.error(`
                ${$translate.instant('ip_dashboard_error')}
                <br />
                ${get(error, 'data.message') || get(error, 'data', error)}
              `);
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

        if (ipBlock.virtualMac.status === 'PENDING') {
          return $translate.instant('ip_virtualmac_add_impossible_status');
        }

        if (ipBlock.virtualMac.status === 'OK') {
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

    $scope.alertsCount = function alertsCount(ipBlock) {
      return (
        get(ipBlock, 'alerts.spam', []).length +
        get(ipBlock, 'alerts.antihack', []).length +
        get(ipBlock, 'alerts.arp', []).length +
        get(ipBlock, 'alerts.mitigation', []).length
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
      refreshAlerts();
    });

    $scope.$on('organisation.change.done', () => {
      init();
      refreshTable();
    });

    $scope.$on('ips.table.params', (event, params) => {
      $scope.params = { ...$scope.params, ...params };
      refreshTable();
    });

    $scope.displayAntispam = function displayAntispam(ipBlock, ip) {
      self.goToAntispam(ip).then(() =>
        $rootScope.$broadcast('ips.antispam.display', {
          ip: ipBlock.ipBlock,
          ipSpamming: ip.ip,
        }),
      );
    };

    $scope.displayFirewall = function displayFirewall(ipBlock, ip) {
      self
        .goToFirewall(ip)
        .then(() => $scope.$broadcast('ips.firewall.display', { ipBlock, ip }));
    };

    $scope.displayGameFirewall = function displayGameFirewall(ipBlock, ip) {
      self
        .goToGameFirewall(ip)
        .then(() =>
          $scope.$broadcast('ips.gameFirewall.display', { ipBlock, ip }),
        );
    };

    $scope.displayOrganisation = function displayOrganisation() {
      self.trackClick('manage-organisation');
      self
        .goToOrganisation()
        .then(() => $scope.$broadcast('ips.organisation.display'));
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

    $scope.goToEditDescription = function goToEditDescription(ipBlock) {
      self.trackPage('edit-description');
      $scope.setAction(
        'ip/block/description/edit/ip-ip-block-description-edit',
        {
          ipBlock,
        },
      );
    };

    $scope.goToUpdateReverse = function goToUpdateReverse(ipBlock, ip) {
      self.trackPage('update-reverse');
      $scope.setAction('ip/reverse/update/ip-ip-reverse-update', {
        ipBlock,
        ip,
      });
    };

    $scope.exportCsv = function exportCsv(ipsList) {
      self.trackPage('export-csv');
      self.trackClick('export-csv');
      $scope.setAction('ip/export-csv/ip-ip-export-csv', { ipsList });
    };

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
      $scope.trackPage(`${TRACKING_PREFIX}::enable-permanent-mitigation`);

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

    $scope.trackPage = function scoppedTrackPage(name) {
      atInternet.trackPage({
        name,
        type: 'navigation',
      });
    };

    $scope.setAction = $scope.$parent.setAction;
    $scope.canImportIPFO = () => ipFeatureAvailability.allowIPFailoverImport();
    $scope.canExportCsv = () => $scope.state.loaded !== $scope.state.total;
    $scope.importIPFO = function importIPFO() {
      self.trackPage('import-failover');
      self.trackClick('import');
      $scope.setAction('ip/legacyOrder/migrate/ip-ip-legacyOrder-migrate');
    };

    refreshAlerts();
    refreshTable();
  }
}
