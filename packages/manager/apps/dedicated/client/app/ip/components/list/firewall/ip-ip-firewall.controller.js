import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import transform from 'lodash/transform';
import union from 'lodash/union';

import {
  FIREWALL_GUIDE_LINKS,
  EDGE_TRACKING_PREFIX,
} from './firewall.constant';
import { TRACKING_PREFIX } from '../list.constant';

export default /* @ngInject */ function IpFirewallCtrl(
  $http,
  $location,
  $route,
  $rootScope,
  $scope,
  $stateParams,
  $timeout,
  $translate,
  Alerter,
  atInternet,
  goToDashboard,
  Ip,
  IpFirewall,
  Validator,
  coreConfig,
) {
  const self = this;

  self.selectedBlock = null;
  self.selectedIp = null;
  self.rules = null;
  self.rulesLoading = false;
  self.rulesLoadingError = null;

  self.rulesTable = [];

  self.constants = {
    MAX_RULES: 20,
    PAGE_SIZE_MIN: 10,
    PAGE_SIZE_MAX: 20,
    CREATION_PENDING: 'creationPending',
    PORT_MIN: 0,
    PORT_MAX: 65535,
    OK: 'ok',
  };

  self.isAddingRule = false;

  self.rule = {};

  self.validator = {
    required: false,
    source: true,
    sourcePort: true,
    destinationPort: true,
    fragment: true,
  };

  self.successMessage = null;
  self.denyMessage = null;
  self.firewallStatus = null;
  self.disabledToggle = false;

  self.firewallGuideLink =
    FIREWALL_GUIDE_LINKS[coreConfig.getUser().ovhSubsidiary] ||
    FIREWALL_GUIDE_LINKS.DEFAULT;

  function paginate(pageSize, offset) {
    self.rulesTable = self.rules.list.results.slice(
      offset - 1,
      offset + pageSize - 1,
    );
  }

  function loadRules(rulesCount, offset) {
    if (!self.selectedIp && !self.selectedBlock) {
      self.selectedIp = $stateParams.ip;
      $http
        .get(`/ip?ip=${window.encodeURIComponent($stateParams.ip)}`)
        .then(({ data }) => {
          if (data.length) {
            [self.selectedBlock] = data;
            self.fetchRules(rulesCount, offset);
          }
        });
    } else if (self.selectedIp) {
      self.fetchRules(rulesCount, offset);
    }
  }

  function loadConstants() {
    IpFirewall.getFirewallRuleConstants().then((constants) => {
      const sequences = IpFirewall.sortList(
        transform(constants.sequences, (result, name, key) => {
          const newResult = result;
          const map = {
            key: name,
            name: parseInt(name.replace('_', ''), 10),
          };
          newResult[key] = map;
        }),
      );
      set(constants, 'sequences', sequences);
      set(constants, 'tcpOptions', union(['NONE'], constants.tcpOptions));
      self.constants = {
        ...self.constants,
        ...constants,
      };
    });
  }

  function init(params) {
    self.rulesLoadingError = null;
    self.rules = null;

    if (params) {
      self.selectedBlock = params.ipBlock.ipBlock;
      self.selectedIp = params.ip.ip;
    }
    $timeout(() => {
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'rulesTable');
    }, 99);
    self.tracking = {
      'ip-firewall-add-deny-rule': `${EDGE_TRACKING_PREFIX}::add-deny-rule`,
      'ip-firewall-add-rule': `${EDGE_TRACKING_PREFIX}::add-rule`,
      'ip-firewall-add-rule-confirm': `${EDGE_TRACKING_PREFIX}::add-rule-confirm`,
      'ip-firewall-add-rule-cancel': `${EDGE_TRACKING_PREFIX}::add-rule-cancel`,
      'ip-firewall-delete-rule': `${EDGE_TRACKING_PREFIX}::delete-rule`,
      'ip-firewall-enable': `${EDGE_TRACKING_PREFIX}::enable`,
      'ip-firewall-disable': `${EDGE_TRACKING_PREFIX}::disable`,
    };
    loadConstants();
    loadRules(self.FIREWALL_MAX_RULES, 0);
  }

  function defaultLoad() {
    init({
      ip: {
        ip: $location.search().ip,
      },
      ipBlock: {
        ipBlock: $location.search().ipBlock,
      },
    });
  }

  function reloadRules() {
    IpFirewall.killPollFirewallRule();
    loadRules(self.FIREWALL_MAX_RULES, 0);
  }

  function getMitigationDetail() {
    IpFirewall.getMitigation(self.selectedBlock, self.selectedIp).then(
      (mitigation) => {
        self.disabledToggle = mitigation;
      },
    );
  }

  function getFirewallDetail() {
    IpFirewall.getFirewallDetails(self.selectedBlock, self.selectedIp).then(
      (firewallDetails) => {
        self.ipBlock = {
          ipBlock: self.selectedBlock,
        };
        self.firewallToggle = {
          status: firewallDetails.enabled,
          ip: self.selectedIp,
          firewall: firewallDetails.enabled ? 'ACTIVATED' : 'DEACTIVATED',
        };
        self.firewallStatus = firewallDetails.enabled;

        getMitigationDetail();
        paginate(self.pageSize, self.offset);
      },
    );
  }

  self.fetchRules = (rulesCount, offset) => {
    self.rulesLoading = true;

    IpFirewall.getFirewallRules(
      self.selectedBlock,
      self.selectedIp,
      rulesCount,
      offset,
    )
      .then(
        (rules) => {
          self.rules = rules;
          let options;

          if (
            self.rules &&
            self.rules.list &&
            self.rules.list.results &&
            self.rules.list.results.length
          ) {
            angular.forEach(self.rules.list.results, (result, i) => {
              options = [];
              if (result.fragments) {
                options.push($translate.instant('ip_firewall_rule_fragments'));
              }
              if (result.tcpOption) {
                options.push(result.tcpOption);
              }

              self.rules.list.results[i].options = options.join('<br/>');

              // Go poll
              if (result.state !== self.constants.OK) {
                IpFirewall.pollFirewallRule(
                  self.selectedBlock,
                  self.selectedIp,
                  result.sequence,
                ).then(() => {
                  self.successMessage = $translate.instant(
                    'ip_firewall_delete_success',
                  );
                  if (result.state === self.constants.CREATION_PENDING) {
                    self.successMessage = $translate.instant(
                      'ip_firewall_add_success',
                    );
                  }
                  reloadRules();
                });
              }
            });
            const index = self.rules.list.results.findIndex((element) => {
              return element.action === 'deny';
            });
            self.denyMessage = index < 0;
          }
        },
        (reason) => {
          self.rulesLoadingError = reason.message;
        },
      )
      .finally(() => {
        // Sort list to display deny action first
        if (self.rules.list.results) {
          self.rules.list.results = IpFirewall.sortList(
            self.rules.list.results,
          );
        }
        self.rulesLoading = false;

        getFirewallDetail();

        // Pagination
        self.pageNumber = 1;
        self.pageSize = self.constants.PAGE_SIZE_MIN;
        self.pageSizeMax = self.constants.PAGE_SIZE_MAX;
        self.offset = 1 + (self.pageNumber - 1) * self.pageSize;
        paginate(self.pageSize, self.offset);
      });
  };

  self.disableItems = ($item) => {
    return self.rules.list.results.some((rule) => {
      return rule.sequence === $item.name;
    });
  };

  $scope.$on('ips.firewall.informations.reload', () => {
    reloadRules();
  });

  $scope.$on('ips.firewall.cancelToggle', () => {
    getFirewallDetail();
  });

  $scope.$on('ips.table.refreshBlock', () => {
    getFirewallDetail();
  });

  self.hideFirewall = function hideFirewall() {
    atInternet.trackClick({
      name: `${TRACKING_PREFIX}::ip::firewall::back`,
      type: 'action',
    });
    Ip.cancelActionParam('firewall');
    IpFirewall.killPollFirewallRule();
    goToDashboard();
  };

  // Come from button
  $scope.$on('ips.firewall.display', (event, params) => {
    init(params);
  });

  // Come from URL
  if ($location.search().action === 'firewall' && $location.search().ip) {
    IpFirewall.getFirewallDetails(
      $location.search().ipBlock,
      $location.search().ip,
    ).then(
      (firewallDetails) => {
        if (!firewallDetails.enabled) {
          $location.search('action', 'toggleFirewall');
          $route.reload();
        } else {
          defaultLoad();
        }
      },
      () => {
        $location.search('action', 'toggleFirewall');
        $route.reload();
      },
    );
  } else {
    init();
  }

  // Change page
  self.onChangePage = ({ pageSize, offset }) => {
    self.pageSize = pageSize;
    self.pageNumber = 1 + Math.floor((offset - 1) / pageSize);
    self.offset = 1 + (self.pageNumber - 1) * self.pageSize;
    $location.search('page', self.pageNumber);
    $location.search('pageSize', self.pageSize);
    paginate(pageSize, offset);
  };

  self.resetOptionField = () => {
    switch (self.rule.protocol) {
      case 'tcp':
        if (!self.rule.tcpOptions) {
          self.rule.tcpOptions = {};
        }
        self.rule.tcpOptions.option = 'NONE';
        break;
      case 'udp':
        delete self.rule.tcpOptions;
        break;
      default:
        delete self.rule.tcpOptions;
        delete self.rule.sourcePort;
        delete self.rule.destinationPort;
        break;
    }
    self.isFirewallRuleFormValid();
  };

  function resetFields() {
    delete self.rule.sequence;
    delete self.rule.action;
    delete self.rule.protocol;
    delete self.rule.source;
    delete self.rule.sourcePort;
    delete self.rule.destinationPort;
    delete self.rule.tcpOptions;
  }

  self.addRuleClick = () => {
    atInternet.trackClick({
      name: self.tracking['ip-firewall-add-rule'],
      type: 'action',
    });

    self.isAddingRule = true;

    // Initialize first available sequence value
    let index = self.constants.sequences[0].name;
    const max = self.constants.sequences.length;
    let savedIndex = 0;
    self.constants.sequences.forEach((sequence) => {
      const el = self.rules.list.results.filter((rule) => {
        return rule.sequence === sequence.name;
      });
      if (el.length > 0) {
        index = sequence.name + 1;
      }
      if (savedIndex < index && index < max) {
        savedIndex = index;
      }
    });
    self.rule.sequence = self.constants.sequences[savedIndex];
  };

  self.cancel = () => {
    atInternet.trackClick({
      name: self.tracking['ip-firewall-add-rule-cancel'],
      type: 'action',
    });

    self.isAddingRule = false;
    resetFields();
  };

  self.isFirewallRuleFormValid = () => {
    const sourceIp = /^(0+\.)+0+$/; // Test only here because it's a firewall specitic case

    // Required field
    self.validator.required =
      self.rule.sequence !== undefined &&
      self.rule.action !== undefined &&
      self.rule.protocol !== undefined;

    self.validator.source = true;
    if (self.rule.source) {
      self.validator.source =
        (Validator.isValidIpv4(self.rule.source) &&
          !sourceIp.test(self.rule.source)) ||
        Validator.isValidIpv4Block(self.rule.source);
    }

    // sourcePort && destinationPort
    self.validator.sourcePort = true;
    self.validator.destinationPort = true;
    if (self.rule.protocol === 'tcp' || self.rule.protocol === 'udp') {
      self.validator.sourcePort = self.rule.sourcePort
        ? !Number.isNaN(self.rule.sourcePort) &&
          !(self.rule.sourcePort < 0 || self.rule.sourcePort > 65535)
        : true;
      self.validator.destinationPort = self.rule.destinationPort
        ? !Number.isNaN(self.rule.destinationPort) &&
          !(self.rule.destinationPort < 0 || self.rule.destinationPort > 65535)
        : true;
    }

    // Fragment
    self.validator.sourcePortNotEmpty = true;
    self.validator.destinationPortNotEmpty = true;
    self.validator.fragment = true;
    if (
      self.rule.tcpOptions &&
      self.rule.tcpOptions.fragments === true &&
      self.rule.protocol === 'tcp'
    ) {
      self.validator.sourcePortNotEmpty = !self.rule.sourcePort;
      self.validator.destinationPortNotEmpty = !self.rule.destinationPort;
      self.validator.fragment =
        self.validator.sourcePortNotEmpty &&
        self.validator.destinationPortNotEmpty;
    }

    return (
      self.validator.required &&
      self.validator.source &&
      self.validator.sourcePort &&
      self.validator.destinationPort &&
      self.validator.fragment
    );
  };

  self.handleKey = ($event) => {
    switch ($event.keyCode) {
      case 13:
        // Enter key
        self.addFirewallRule();
        break;
      case 27:
        // Escape key
        self.cancel();
        break;
      default:
        // Nothing to do
        break;
    }
  };

  self.addFirewallRule = () => {
    const isValid = self.isFirewallRuleFormValid();
    if (!isValid) {
      Alerter.error(
        $translate.instant('ip_firewall_check_errors'),
        'check_validity_error',
      );
      return;
    }

    atInternet.trackClick({
      name: self.tracking['ip-firewall-add-rule-confirm'],
      type: 'action',
    });

    // set empty string to null values to avoid API error
    self.rule.source = isEmpty(get(self.rule, 'source', '').trim())
      ? null
      : self.rule.source;

    IpFirewall.addFirewallRule(
      self.selectedBlock,
      self.selectedIp,
      self.rule,
    ).then(
      (data) => {
        // Reload rules
        $rootScope.$broadcast('ips.firewall.informations.reload', data);
        self.isAddingRule = false;
        resetFields();
      },
      (data) => {
        $scope.loading = false;
        Alerter.alertFromSWS(
          $translate.instant('ip_firewall_add_rule_fail'),
          data.data,
          'addRuleAlert',
        );
      },
    );
  };

  self.onDismissSuccess = () => {
    self.successMessage = null;
  };

  self.createDenyRule = () => {
    atInternet.trackClick({
      name: self.tracking['ip-firewall-add-deny-rule'],
      type: 'action',
    });

    self.rulesLoading = true;

    // Initialize action value
    self.rule.action = 'deny';

    // Initialize rule sequence
    let index = self.constants.sequences.findIndex((element) => {
      return element.name === 19;
    });
    self.rule.sequence = self.constants.sequences[index];

    // Initialize rule protocol
    index = self.constants.protocols.findIndex((element) => {
      return element === 'ipv4';
    });
    self.rule.protocol = self.constants.protocols[index];

    self.isAddingRule = true;
    self.rulesLoading = false;

    self.resetOptionField();
  };

  self.selectFragments = () => {
    self.rule.sourcePort = null;
    self.rule.destinationPort = null;
  };
}
