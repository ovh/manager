import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

export default class DashboardController {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $translate,
    Ip,
    IpDashboardReverse,
    IpDashboardVirtualMac,
    ipFeatureAvailability,
    Validator,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.Ip = Ip;
    this.IpDashboardReverse = IpDashboardReverse;
    this.IpDashboardVirtualMac = IpDashboardVirtualMac;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.Validator = Validator;

    this.mainQueue = [];

    $scope.getService = this.getService.bind(this);
    $scope.containsAllServices = false;
    $scope.getAll = false;

    $scope.loaders = {
      reverseDelegations: false,
    };

    $scope.canImportIPFO = () => ipFeatureAvailability.allowIPFailoverImport();
    $scope.canOrderLegacyIPFO = () =>
      ipFeatureAvailability.allowIPFailoverOrderLegacy();

    $scope.canReverseDelegations = (ipBlock) => {
      return ipBlock.version === 'IPV6' && /(\/64|\/56)$/.test(ipBlock.ipBlock);
    };

    $scope.getReverseDelegations = (ipBlock) => {
      set(ipBlock, 'reverseDelegationsRefresh', true);
      return IpDashboardReverse.getDelegations(ipBlock.ipBlock)
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

    $scope.getVirtualMacMessage = (ipBlock) => {
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

    // If service selected: load only this service,
    // else, load all of them
    $scope.selectService = () => {
      this.$state.go('.', { serviceName: $scope.filters.service.serviceName });

      return this.getServices();
    };

    $scope.alertsCount = (ipBlock) => {
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

    $scope.alertsTooltip = (ipBlock) => {
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
    $scope.toggleIp = (ipBlock, forceOpen) => {
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
          this.checkIps(ipBlock);
          set(ipBlock, 'collapsed', false);
          set(ipBlock, 'loaded', true);
        })
        .catch((err) =>
          this.goToDashboard({
            message: {
              text: $translate.instant('ip_service_error', {
                t0: ipBlock.ipBlock,
              }),
              data: {
                ...err,
                type: 'ERROR',
              },
            },
          }),
        )
        .finally(() => {
          set(ipBlock, 'loading', false);
        });
    };

    $scope.$on('$destroy', () => {
      this.killAllPolling();
    });

    // ---

    $scope.$on('ips.table.refreshBlock', (e, ipBlock) => {
      set(ipBlock, 'refreshing', true);
      if ($scope.canReverseDelegations(ipBlock)) {
        $scope.getReverseDelegations(ipBlock);
      }

      const isUniqueIp = ipBlock.isUniq;
      const updateReversePromise = isUniqueIp
        ? this.getService(ipBlock.service)
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

        this.checkIps(ipBlock);
        set(ipBlock, 'refreshing', false);
      });
    });

    $scope.$on('ips.table.refreshVmac', (e, ipBlock) => {
      if (ipBlock.service.category === 'DEDICATED') {
        set(ipBlock, 'service.loading.virtualmac', true);
        IpDashboardVirtualMac.getVirtualMacList(ipBlock.service)
          .then((vmacInfos) => {
            set(ipBlock, 'service.virtualmac', vmacInfos);

            if (vmacInfos && vmacInfos.status === 'PENDING') {
              this.pollVirtualMacs(ipBlock.service);
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

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    $scope.getStatePercent = () => {
      return Math.ceil(($scope.state.loaded / $scope.state.total) * 100);
    };

    /*= =========  Reverse inline  ========== */

    $scope.reverseIsValid = (reverse) => {
      return (
        !reverse ||
        (reverse && Validator.isValidDomain(reverse.replace(/\.$/, '')))
      );
    };
    $scope.editReverseInline = (ipBlock, ip) => {
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
    $scope.editReverseInlineApply = (ipBlock, ip, e) => {
      e.stopPropagation();
      set(ipBlock, 'refreshing', true);
      IpDashboardReverse.updateReverse(ipBlock, ip.ip, ip.reverseEditValue)
        .then(() =>
          this.goToDashboard(
            {
              message: {
                text: $translate.instant('ip_table_manage_reverse_success'),
                data: 'OK',
              },
            },
            { reload: true },
          ),
        )
        .catch((data) => {
          set(ipBlock, 'refreshing', false);

          return this.goToDashboard({
            message: {
              text: $translate.instant('ip_table_manage_reverse_failure'),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          });
        });
    };
    $scope.editReverseInlineCancel = (ipBlock, ip, e) => {
      e.stopPropagation();
      set(ip, 'reverseEdit', false);
    };
  }

  $onInit() {
    this.$scope.alerts = {
      mitigation: [],
      antihack: [],
      arp: [],
      spam: [],
    };

    this.$scope.loading = {};
    this.$scope.state = {};

    this.$scope.services = [];

    this.$scope.filters = {
      service: {},
    };

    return this.loadDashboard();
  }

  loadDashboard() {
    this.$scope.loading.init = true;
    this.$scope.ipsList = [];

    this.Ip.getPriceForParking().then((price) => {
      this.$scope.parkPrice = price;
    });

    this.Ip.getServicesList()
      .then((services) => {
        // Get only trusted services, and sort them
        this.$scope.services = sortBy(services, ['category', 'serviceName']);

        // Add others to the list of services
        this.$scope.services.unshift(
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
        this.$scope.filters.service =
          this.$scope.services[2] || head(this.$scope.services);

        // If serviceName in URL param
        if (this.serviceName) {
          const selectedService = find(this.$scope.services, {
            serviceName: this.serviceName,
          });
          if (selectedService) {
            this.$scope.filters.service = selectedService;
          }
        }

        return this.getServices();
      })
      .finally(() => {
        this.$scope.loading.init = false;
      });
  }

  getService(service) {
    set(service, 'loading', {});
    set(service, 'detailsLoaded', false);

    return this.Ip.getIpsListForService(service.serviceName).then(
      (_ipBlocks) => {
        let ipBlocks = _ipBlocks;

        if (!ipBlocks) {
          return null;
        }

        angular.forEach(ipBlocks, (ipBlock) => {
          // Add service pointer to each ipBlock
          set(ipBlock, 'service', service);

          // Sanitize IPs
          this.checkIps(ipBlock);
        });

        ipBlocks = ipBlocks.sort(DashboardController.sortIp);

        const reverseDelegationPromise = this.$q.all(
          values(
            map(
              filter(ipBlocks, this.$scope.canReverseDelegations),
              this.$scope.getReverseDelegations,
            ),
          ),
        );

        let virtualMacPromise = this.$q.when();

        const cloudIpSubTypePromise = this.$q.all(
          ipBlocks.map(this.checkCloudIpSubtype.bind(this)),
        );

        // if service DEDICATED: get vmacs
        if (service.category === 'DEDICATED') {
          set(service, 'loading.virtualmac', true);
          virtualMacPromise = this.IpDashboardVirtualMac.getVirtualMacList(
            service,
          )
            .then((vmacInfos) => {
              set(service, 'virtualmac', vmacInfos);

              if (vmacInfos && vmacInfos.status === 'PENDING') {
                this.pollVirtualMacs(service);
              }
            })
            .finally(() => {
              set(service, 'loading.virtualmac', false);
            });
        }

        this.$q
          .all([
            reverseDelegationPromise,
            virtualMacPromise,
            cloudIpSubTypePromise,
          ])
          .then(() => {
            set(service, 'detailsLoaded', true);
          });

        return ipBlocks;
      },
    );
  }

  getServices() {
    this.killAllPolling();

    this.$scope.getAll = this.$scope.state.total === this.$scope.state.loaded;

    this.$q
      .when(this.mainQueue)
      .then(() => {
        // We already have all services loaded, filter to select the one desired.
        if (
          this.$scope.containsAllServices &&
          get(this.$scope, 'filters.service.serviceName') === 'ALL'
        ) {
          this.$scope.ipsList = filter(this.$scope.allIpsList, {
            routedTo: this.$scope.filters.service.serviceName,
          });
          return null;
        }

        let queue = [];
        this.$scope.ipsList = [];
        this.$scope.servicesInError = [];
        this.$scope.state.loaded = 0;
        this.$scope.loading.table = true;

        if (
          this.$scope.filters.service &&
          this.$scope.filters.service.serviceName === '_ALL'
        ) {
          this.$scope.state.total = this.$scope.services.length - 1; // -1 = "_ALL"

          queue = this.$scope.services.map((service) => {
            if (service.serviceName !== '_ALL') {
              return this.getService(service)
                .then((ipBlocks) => {
                  this.$scope.ipsList = this.$scope.ipsList.concat(ipBlocks);
                })
                .catch(() => {
                  this.$scope.servicesInError.push(service.serviceName);
                })
                .finally(() => {
                  this.$scope.state.loaded += 1;
                });
            }
            return null;
          });
        } else {
          this.$scope.state.total = 1;
          queue.push(
            this.getService(this.$scope.filters.service)
              .then((ipBlocks) => {
                this.$scope.ipsList = this.$scope.ipsList.concat(ipBlocks);
              })
              .catch(() => {
                this.$scope.servicesInError.push(
                  this.$scope.filters.service.serviceName,
                );
              })
              .finally(() => {
                this.$scope.state.loaded += 1;
              }),
          );
        }

        this.mainQueue = this.$q.all(queue).then(() => {
          this.$scope.containsAllServices =
            this.$scope.getAll &&
            this.$scope.filters.service.serviceName === '_ALL';

          if (this.$scope.servicesInError.length) {
            return this.goToDashboard({
              message: {
                text: this.$translate.instant('ip_services_error', {
                  t0: this.$scope.servicesInError.join(', '),
                }),
                data: 'ERROR',
              },
            });
          }

          return null;
        });

        return this.mainQueue;
      })
      .finally(() => {
        this.$scope.loading.table = false;
        this.refreshAlerts();
      });
  }

  pollVirtualMacs(service) {
    this.IpDashboardVirtualMac.pollVirtualMacs(service).then((vmacInfos) => {
      set(service, 'virtualmac', vmacInfos);
    });
  }

  killAllPolling() {
    this.Ip.killAllGetIpsListForService();
    this.IpDashboardVirtualMac.killPollVirtualMacs();
    this.Ip.killPollFirewallState();
    this.Ip.killPollMitigationState();
  }

  refreshAlerts() {
    this.$scope.alerts = {
      mitigation: [],
      antihack: [],
      arp: [],
      spam: [],
    };

    angular.forEach(this.$scope.ipsList, (ipBlock) => {
      if (ipBlock.alerts) {
        if (ipBlock.alerts.spam && ipBlock.alerts.spam.length) {
          this.$scope.alerts.spam = this.$scope.alerts.spam.concat(
            ipBlock.alerts.spam,
          );
        }
        if (ipBlock.alerts.antihack && ipBlock.alerts.antihack.length) {
          this.$scope.alerts.antihack = this.$scope.alerts.antihack.concat(
            ipBlock.alerts.antihack,
          );
        }
        if (ipBlock.alerts.arp && ipBlock.alerts.arp.length) {
          this.$scope.alerts.arp = this.$scope.alerts.arp.concat(
            ipBlock.alerts.arp,
          );
        }
        if (ipBlock.alerts.mitigation && ipBlock.alerts.mitigation.length) {
          this.$scope.alerts.mitigation = this.$scope.alerts.mitigation.concat(
            ipBlock.alerts.mitigation,
          );
        }
      }
    });
  }

  checkIps(ipBlock) {
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
      this.Ip.killPollFirewallState(ipBlock, ip);
      // Stop all pending polling for this ipBlock/ip
      this.Ip.killPollMitigationState(ipBlock, ip);

      // Poll mitigation state
      if (
        ip.mitigation === 'CREATION_PENDING' ||
        ip.mitigation === 'REMOVAL_PENDING'
      ) {
        this.Ip.pollMitigationState(ipBlock, ip).then(() => {
          this.Ip.getIpsForIpBlock(
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
        this.Ip.pollFirewallState(ipBlock, ip).then(() => {
          this.Ip.getIpsForIpBlock(
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

  static sortIp(a, b) {
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

  checkCloudIpSubtype(ipBlock) {
    const isCloud =
      ipBlock && ipBlock.service && ipBlock.service.category === 'CLOUD';
    const isFailover = ipBlock && ipBlock.type === 'FAILOVER';

    if (isCloud && isFailover && ipBlock.ips && ipBlock.ips.length) {
      // since ips have the same subType in a given ipBlock,
      // we are only checking the subType of the first IP to guess the block subType
      return this.Ip.getCloudIpSubType(
        ipBlock.service.serviceName,
        head(ipBlock.ips).ip,
      ).then((subType) => {
        set(ipBlock, 'subType', subType);
      });
    }
    return this.$q.when();
  }
}
