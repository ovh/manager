import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import toInteger from 'lodash/toInteger';
import punycode from 'punycode';

import {
  IP_TYPE,
  SUB_RANGE,
  TRACKING_PREFIX,
  BADGE_BYOIP,
  BADGE_FO,
  BADGES,
  ADDITIONAL_IP,
  VRACK,
  PCC,
  FAILOVER,
  SECURITY_URL,
  IP_COMPONENTS_LIST_TRACKING_HIT,
  PAGE_SIZE_MIN,
  PAGE_SIZE_MAX,
  FILTER_OPTIONS,
  TRACKING_OPTIONS,
  ADMIN_ROLE,
  IP_LISTING_ID,
} from './list.constant';

export default class IpListController {
  /* @ngInject */
  constructor(
    $http,
    $location,
    $q,
    $rootScope,
    $scope,
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
    coreURLBuilder,
    coreConfig,
  ) {
    this.$http = $http;
    this.$location = $location;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
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
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    const self = this;
    const {
      $http,
      $location,
      $q,
      $rootScope,
      $scope,
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
      coreConfig,
    } = this;
    let cancelFetch;
    let versionFilter = null;
    const { ipTypeFilter } = $location.search();

    if (Object.values(FILTER_OPTIONS).includes(parseInt(ipTypeFilter, 10))) {
      versionFilter = parseInt(ipTypeFilter, 10);
    }

    $scope.IP_LISTING_ID = IP_LISTING_ID;
    $scope.IP_TYPE = IP_TYPE;
    $scope.SUB_RANGE = SUB_RANGE;
    $scope.ADDITIONAL_IP = ADDITIONAL_IP;
    $scope.FILTER_OPTIONS = FILTER_OPTIONS;
    $scope.VRACK = VRACK;
    $scope.PCC = PCC;
    $scope.FAILOVER = FAILOVER;
    $scope.showBYOIPBadge = (self.badges || BADGES).includes(BADGE_BYOIP);
    $scope.showFOBadge = (self.badges || BADGES).includes(BADGE_FO);
    $scope.version = versionFilter;
    $scope.selected_option = versionFilter || FILTER_OPTIONS.ALL_IPS;
    $scope.PAGE_SIZE_MAX = PAGE_SIZE_MAX;

    this.securityUrl =
      SECURITY_URL[coreConfig.getUser().ovhSubsidiary] || SECURITY_URL.DEFAULT;

    function loadAdvancedModeConfig() {
      const savedConfig = localStorage.getItem(`${$scope.IP_LISTING_ID}Config`);
      $scope.advancedModeFilter = !!parseInt(savedConfig, 10);
    }

    function init() {
      loadAdvancedModeConfig();
      // pagination
      const { page, pageSize } = $location.search();
      $scope.pageNumber = toInteger(page) || 1;
      $scope.pageSize = toInteger(pageSize) || PAGE_SIZE_MIN;
      if ($scope.pageNumber < 1) {
        $scope.pageNumber = 1;
      }
      if ($scope.pageSize < PAGE_SIZE_MIN) {
        $scope.pageSize = PAGE_SIZE_MIN;
      } else if ($scope.pageSize > PAGE_SIZE_MAX) {
        $scope.pageSize = PAGE_SIZE_MAX;
      }
      $scope.paginationOffset = 1 + ($scope.pageNumber - 1) * $scope.pageSize;

      $scope.loading = {};
      $scope.state = {};
      $scope.serviceType =
        self.serviceType || $location.search().serviceType || null;
      $scope.params = self.params || null;
      $scope.isAdditionalIp = self.isAdditionalIp;
      $scope.isAdmin = coreConfig.getUser().auth?.roles?.includes(ADMIN_ROLE);

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
        'delete-vrack': `${TRACKING_PREFIX}::delete-vrack`,
        'delete-pcc': `${TRACKING_PREFIX}::delete-pcc`,
        'mac-details': `${TRACKING_PREFIX}::mac-details`,
        'mac-delete': `${TRACKING_PREFIX}::mac-delete`,
        'ip-firewall-add-rule': `${TRACKING_PREFIX}::ip::firewall::add-rule`,
        'ip-firewall-delete-rule': `${TRACKING_PREFIX}::ip::firewall::delete-rule`,
      };
    }

    function saveAdvancedModeConfig(advancedModeValue) {
      localStorage.setItem(
        `${$scope.IP_LISTING_ID}Config`,
        advancedModeValue ? 1 : 0,
      );
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
      const isAdditionalIpv6 =
        (ipBlock.version === IP_TYPE.V6 &&
          (ipBlock.type === FAILOVER || ipBlock.type === VRACK)) ||
        false;
      const isIPv6Failover =
        ipBlock.version === IP_TYPE.V6 && ipBlock.type === FAILOVER;
      if (!(ipBlock.ips && ipBlock.ips.length)) {
        Object.assign(ipBlock, {
          hasSpamAlerts: ipBlock.alerts.spam?.length > 0,
          hasAntihackAlerts: ipBlock.alerts.antihack?.length > 0,
          hasMitigationAlerts: ipBlock.alerts.mitigation?.length > 0,
          isAdditionalIpv6,
          isIPv6Failover,
        });
        return;
      }

      Object.assign(ipBlock, {
        hasSpamAlerts: false,
        hasAntihackAlerts: false,
        hasMitigationAlerts: false,
        isAdditionalIpv6,
        isIPv6Failover,
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

        // Poll virtual mac
        if (get(ipBlock, 'virtualMac.status') === 'PENDING') {
          IpVirtualMac.pollVirtualMacs(ipBlock.service).then(() => {
            refreshIp(ipBlock.ipBlock).then((refreshedIp) => {
              Object.assign(ipBlock, refreshedIp);
            });
          });
        }

        Object.assign(ip, {
          hasSpamAlerts: ip.spam === 'BLOCKED_FOR_SPAM',
          hasAntihackAlerts: ip.antihack === 'BLOCKED',
          hasMitigationAlerts: ip.mitigation === 'FORCED',
        });

        // Alerts
        if (ip.hasSpamAlerts) {
          Object.assign(ipBlock, { hasSpamAlerts: true });
        }
        if (ip.hasAntihackAlerts) {
          Object.assign(ipBlock, { hasAntihackAlerts: true });
        }
        if (ip.hasMitigationAlerts) {
          Object.assign(ipBlock, { hasMitigationAlerts: true });
        }
      });
    }

    function refreshTable() {
      if (cancelFetch) {
        cancelFetch();
      }

      $scope.loading.table = true;
      $scope.ipsList = [];

      const { cancel, request } = Ip.fetchIps({
        serviceType: $scope.serviceType,
        otherParams: $scope.params,
        pageNumber: $scope.pageNumber,
        pageSize: $scope.pageSize,
        version: $scope.version,
        isAdditionalIp: $scope.isAdditionalIp,
        simpleMode: true,
      });
      cancelFetch = cancel;
      request
        .then(({ count, ips }) => {
          $scope.ipsCount = count;
          $scope.ipsList = map(ips, (ip) => {
            return {
              ...ip,
              collapsed: !ip.isUniq,
              fetchingData: true,
            };
          });
          $scope.loading.table = false;
          $scope.ipsList.forEach((ip) => {
            refreshIp(ip.ipBlock)
              .then((refreshedIp) => {
                Object.assign(ip, refreshedIp);
                checkIps(ip);
              })
              .finally(() => {
                set(ip, 'fetchingData', false);
              });
          });
        })
        .catch((error) => {
          if (error?.xhrStatus === 'abort') {
            return;
          }
          $scope.loading.table = false;
          Alerter.error(`
            ${$translate.instant('ip_dashboard_error')}
            <br />
            ${get(error, 'data.message') || get(error, 'data', error)}
          `);
        })
        .finally(() => {
          cancelFetch = null;
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
      let ipsService;
      set(ipBlock, 'loading', true);
      if (ipBlock.version === IP_TYPE.V6 && ipBlock.type === VRACK) {
        ipsService = Ip.getIpsForIpV6(
          ipBlock.ipBlock,
          get(ipBlock, 'routedTo.serviceName'),
        );
      } else {
        ipsService = Ip.getIpsForIpBlock(
          ipBlock.ipBlock,
          get(ipBlock, 'routedTo.serviceName'),
          ipBlock.type,
        );
      }
      return ipsService
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
    });

    $scope.$on('organisation.change.done', () => {
      init();
      refreshTable();
    });

    $scope.$on('ips.table.params', (event, params) => {
      init();
      $scope.params = { ...$scope.params, ...params };
      refreshTable();
    });

    $scope.$on('$destroy', () => {
      if (cancelFetch) {
        cancelFetch();
      }
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
        .then(() =>
          $rootScope.$broadcast('ips.firewall.display', { ipBlock, ip }),
        );
    };

    $scope.displayGameFirewall = function displayGameFirewall(ipBlock, ip) {
      self
        .goToGameFirewall(ip)
        .then(() =>
          $rootScope.$broadcast('ips.gameFirewall.display', { ipBlock, ip }),
        );
    };

    $scope.displayStatistics = self.goToStatistics;

    $scope.displayOrganisation = function displayOrganisation() {
      self.trackClick(
        self.trackingData.prefix,
        IP_COMPONENTS_LIST_TRACKING_HIT.ORGANISATION,
      );
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

    $scope.goToEditOrAssociate = function goToEditOrAssociate(ipBlock) {
      $scope.setAction('ip/block/editAssociate/ip-ip-block-edit-associate', {
        ipBlock,
      });
    };

    $scope.goToUpdateReverse = function goToUpdateReverse(ipBlock, ip) {
      self.trackPage('update-reverse');
      $scope.setAction('ip/reverse/update/ip-ip-reverse-update', {
        ipBlock,
        ip,
      });
    };

    $scope.goToVrack = function goToVrack(ipBlock) {
      if (ipBlock.type === VRACK && ipBlock.routedTo?.serviceName) {
        self.goToVrack(ipBlock.routedTo?.serviceName);
      }
    };

    $scope.exportCsv = function exportCsv() {
      self.trackPage('export-csv');
      self.trackClick(
        self.trackingData.prefix,
        IP_COMPONENTS_LIST_TRACKING_HIT.EXPORT,
      );
      $scope.setAction('ip/export-csv/ip-ip-export-csv', {
        serviceType: $scope.serviceType,
        otherParams: $scope.params,
      });
    };

    $scope.onAdvancedModeFilterChanged = function onAdvancedModeFilterChanged(
      advancedModeValue,
    ) {
      saveAdvancedModeConfig(advancedModeValue);
      $timeout(() => {
        atInternet.trackClick({
          type: 'action',
          name: [
            self.trackingData.filtersPrefix,
            $scope.advancedModeFilter
              ? IP_COMPONENTS_LIST_TRACKING_HIT.ADVANCED_MODE_ON
              : IP_COMPONENTS_LIST_TRACKING_HIT.ADVANCED_MODE_OFF,
          ].join('::'),
        });
      });
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
      }, 500);
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

    $scope.setAction = self.setAction || $scope.$parent.setAction;
    $scope.canImportIPFO = () => ipFeatureAvailability.allowIPFailoverImport();
    $scope.canExportCsv = () =>
      $scope.loading.table === false && $scope.ipsList?.length > 0;
    $scope.importIPFO = function importIPFO() {
      self.trackPage('import-failover');
      self.trackClick(
        self.trackingData.prefix,
        IP_COMPONENTS_LIST_TRACKING_HIT.IMPORT,
      );
      $scope.setAction('ip/legacyOrder/migrate/ip-ip-legacyOrder-migrate');
    };

    $scope.getIpsOnFilter = function getIpsOnFilter(version) {
      $location.search('ipTypeFilter', version);
      $location.search('page', 1);
      $scope.version = version;
      atInternet.trackClick({
        name:
          FILTER_OPTIONS.IPV4 === version
            ? TRACKING_OPTIONS.IPV4
            : TRACKING_OPTIONS.IPV6,
        type: 'action',
        chapter1: TRACKING_OPTIONS.TRACK_CHAPTER1,
      });
      $rootScope.$broadcast('ips.table.reload');
    };

    refreshTable();
  }
}
