import head from 'lodash/head';
import set from 'lodash/set';

angular.module('App').controller('ServerIpCtrl', [
  '$rootScope',
  '$scope',
  '$timeout',
  '$translate',
  'Server',
  'FIREWALL_STATUSES',
  'MITIGATION_STATUSES',

  function ServerIpCtrl(
    $rootScope,
    $scope,
    $timeout,
    $translate,
    Server,
    firewallStatuses,
    mitigationStatuses,
  ) {
    $scope.firewallStatuses = firewallStatuses;
    $scope.mitigationStatuses = mitigationStatuses;
    $scope.status = {
      BLOCKED_FOR_SPAM: 'BLOCKED_FOR_SPAM',
      UNBLOCKED: 'UNBLOCKED',
      UNBLOCKING: 'UNBLOCKING',
    };

    /* Block parameters */
    $scope.blocks = null;
    $scope.selectedBlock = {
      value: null,
    };
    $scope.blockError = null;

    /* Ip parameters */
    $scope.ips = null;
    $scope.selectedIp = null;
    $scope.ipsLoading = false;
    $scope.ipsError = null;

    $scope.manageable = true;

    /* Navigation paramaters */
    $scope.displayed = false;

    $rootScope.$on('ips.display', () => {
      $scope.displayed = true;
    });

    $scope.$on('ips.informations.reload', () => {
      $scope.reloadIps();
    });

    $scope.$watch('selectedBlock.value', () => {
      if ($scope.selectedBlock.value !== null) {
        $scope.$broadcast('paginationServerSide.loadPage', 1, 'ipsTable');
      }
    });

    $scope.canDisplayEnableFirewall = function canDisplayEnableFirewall(ip) {
      return (
        ip.mitigationStatus !== mitigationStatuses.FORCED &&
        ip.firewallStatus === firewallStatuses.DEACTIVATED
      );
    };

    $scope.canDisplayDisableFirewall = function canDisplayDisableFirewall(ip) {
      return (
        ip.mitigationStatus === mitigationStatuses.AUTO &&
        ip.firewallStatus === firewallStatuses.ACTIVATED
      );
    };

    $scope.canDisplayDisableFirewallMitigationActivated = function displayDisableFirewallMitigation(
      ip,
    ) {
      return (
        !$scope.canDisplayEnableFirewall(ip) &&
        !$scope.canDisplayDisableFirewall(ip) &&
        ip.firewallStatus !== firewallStatuses.NOT_CONFIGURED
      );
    };

    $scope.loadBlocks = function loadBlocks() {
      Server.getBlocks().then(
        (blocks) => {
          $scope.blocks = blocks;
          if (blocks.length > 0) {
            $scope.selectedBlock.value = head(blocks);
          }
          Server.checkIfAntispam().then((params) => {
            if (!params) {
              $scope.displayed = true;
            } else {
              $rootScope.$broadcast('ips.antispam.loadbyurl', params);
            }
          });
        },
        (reason) => {
          $scope.blockError = reason.message;
        },
      );
    };

    $scope.reloadIps = function reloadIps() {
      if ($scope.selectedBlock.value !== null) {
        $scope.$broadcast('paginationServerSide.reload', 'ipsTable');
      }
    };

    $scope.loadIps = function loadIps(ipsCount, offset) {
      $scope.manageable = true;
      if ($scope.selectedBlock.value) {
        if ($scope.selectedBlock.value.manageable === true) {
          $scope.ipsLoading = true;
          $scope.ipsError = null;
          Server.getIps($scope.selectedBlock.value.ip, ipsCount, offset).then(
            (ips) => {
              $scope.ips = ips;
              $scope.ipsLoading = false;
            },
            (reason) => {
              $scope.ipsError = reason.message;
              $scope.ipsLoading = false;
            },
          );
        } else {
          $scope.manageable = false;
        }
      }
    };

    $scope.displayFirewall = function displayFirewall(ip, $event) {
      $scope.selectedIp = ip;
      $scope.displayed = false;
      $rootScope.$broadcast('ips.firewall.display', {
        block: $scope.selectedBlock,
        ip: $scope.selectedIp,
      });

      // Prevent bubbling to selectIp which sets $scope.selectedIp to null every other call
      if ($event.stopPropagation) {
        $event.stopPropagation();
      }
      if ($event.preventDefault) {
        $event.preventDefault();
      }
      set($event, 'cancelBubble', true);
      set($event, 'returnValue', false);
    };

    $scope.displayAntispam = function displayAntispam(ip, ipSpamming) {
      $scope.displayed = false;

      $rootScope.$broadcast('ips.antispam.display', { ip, ipSpamming });

      // Prevent bubbling to selectIp which sets $scope.selectedIp to null every other call
      // if ($event.stopPropagation) {
      //     $event.stopPropagation();
      // }
      // if ($event.preventDefault) {
      //     $event.preventDefault();
      // }
      // $event.cancelBubble = true;
      // $event.returnValue = false;
    };

    $scope.getSelectedBlockAndIp = function getSelectedBlockAndIp(ip) {
      return { ip, block: $scope.selectedBlock.value };
    };

    $scope.loadBlocks();
  },
]);

angular.module('App').controller('ServerIpFirewallCtrl', [
  '$rootScope',
  '$scope',
  '$translate',
  'Server',
  'FIREWALL_STATUSES',

  function ServerIpFirewallCtrl(
    $rootScope,
    $scope,
    $translate,
    Server,
    firewallStatuses,
  ) {
    $scope.selectedBlock = null;
    $scope.selectedIp = null;
    $scope.loading = true;
    $scope.rules = null;
    $scope.firewall = null;
    $scope.rulesLoading = false;
    $scope.rulesLoadingError = null;
    $scope.displayed = false;
    $scope.firewallStatuses = firewallStatuses;

    $rootScope.$on('ips.firewall.display', (event, params) => {
      $scope.selectedBlock = params.block;
      $scope.selectedIp = params.ip;
      $scope.displayed = true;
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'rulesTable');
    });

    $scope.$on('ips.firewall.informations.reload', () => {
      $scope.reloadRules();
    });

    $scope.reloadRules = function reloadRules() {
      $scope.$broadcast('paginationServerSide.reload', 'rulesTable');
    };

    $scope.loadRules = function loadRules(rulesCount, offset) {
      if ($scope.selectedIp && $scope.selectedIp.ip) {
        $scope.rulesLoading = true;
        Server.getFirewallDetails(
          $scope.selectedBlock.value.ip,
          $scope.selectedIp.ip,
        ).then((firewall) => {
          $scope.firewall = firewall;
        });

        Server.getFirewallRules(
          $scope.selectedBlock.value.ip,
          $scope.selectedIp.ip,
          rulesCount,
          offset,
        )
          .then((rules) => {
            $scope.rules = rules;
            for (
              let i = 0, n = $scope.rules.list.results.length;
              i < n;
              i += 1
            ) {
              if ($scope.rules.list.results[i].options) {
                $scope.rules.list.results[i].options.sort();
                $scope.rules.list.results[
                  i
                ].optionsDisplay = $scope.rules.list.results[i].options.join(
                  '<br>',
                );
              }
            }
            $scope.loading = false;
            $scope.rulesLoading = false;
          })
          .catch((reason) => {
            $scope.rulesLoading = false;
            $scope.rulesLoadingError = reason.message;
          });
      }
    };

    $scope.hideFirewall = function hideFirewall() {
      $scope.displayed = false;
      $rootScope.$broadcast('ips.display');
    };

    //    $scope.reloadRules();
  },
]);

angular
  .module('App')
  .controller(
    'ServerIpAntispamCtrl',
    ($rootScope, $scope, $location, Server, $translate) => {
      $scope.displayedAntispam = false;
      $scope.ipspam = null;
      $scope.ipspamStats = null;
      $scope.block = null;
      $scope.ipSpamparam = null;
      $scope.endDate = null;
      $scope.antispamLoadingError = null;
      $scope.loadingAntiSpam = false;
      $scope.status = {
        BLOCKED_FOR_SPAM: 'BLOCKED_FOR_SPAM',
        UNBLOCKED: 'UNBLOCKED',
        UNBLOCKING: 'UNBLOCKING',
      };

      function init(params) {
        $scope.displayedAntispam = true;
        $scope.block = params.ip;
        $scope.ipSpamparam = params.ipSpamming;
      }

      $scope.loadAntispam = function loadAntispam(count, offset) {
        if ($scope.displayedAntispam) {
          $scope.antispamLoadingError = null;
          $scope.loadingAntiSpam = true;
          Server.getIpSpam(
            $scope.block,
            $scope.ipSpamparam,
            count,
            offset,
          ).then(
            (ipSpamming) => {
              $scope.ipspam = ipSpamming;
              if ($scope.ipspam.state === $scope.status.BLOCKED_FOR_SPAM) {
                $scope.endDate = new Date($scope.ipspam.date);
                $scope.endDate = new Date(
                  +$scope.endDate + $scope.ipspam.time * 1000,
                );
              }
              $scope.displayedAntispam = true;
              $scope.loadingAntiSpam = false;
            },
            (reason) => {
              $scope.displayedAntispam = true;
              $scope.loadingAntiSpam = false;
              $scope.antispamLoadingError = reason.message;
            },
          );
        }
      };

      // come from button
      $rootScope.$on('ips.antispam.display', (event, params) => {
        init(params);
        $scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'antispamPeriods',
        );
      });

      // come from button
      $rootScope.$on('ips.antispam.loadbyurl', (event, params) => {
        $location.search('action', null);
        $location.search('ip', null);
        $location.search('ipSpamming', null);
        init(params);
        $scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'antispamPeriods',
        );
      });

      $scope.hideAntispam = function hideAntispam() {
        $scope.displayedAntispam = false;
        $rootScope.$broadcast('ips.display');
      };

      $scope.unblockIp = function unblockIp() {
        if ($scope.canBeUnblocking()) {
          Server.unblockIp($scope.block, $scope.ipspam.ipSpamming).then(
            () => {
              init({ ip: $scope.block, ipSpamming: $scope.ipSpamparam });
              $scope.$broadcast(
                'paginationServerSide.reload',
                'antispamPeriods',
              );
            },
            (data) => {
              set(data, 'type', 'ERROR');
              $scope.setMessage(
                $translate.instant('server_configuration_antispam_error', {
                  t0: $scope.ipspam.ip,
                }),
                data.data,
              );
            },
          );
        }
      };

      $scope.canBeUnblocking = function canBeUnblocking() {
        if ($scope.endDate) {
          return $scope.endDate <= new Date(Date.now());
        }
        return false;
      };

      $scope.isIpSpamming = function isIpSpamming() {
        return (
          $scope.ipspam &&
          $scope.ipspam.state === $scope.status.BLOCKED_FOR_SPAM
        );
      };
    },
  );

angular
  .module('App')
  .controller(
    'ServerIpAntispamDetailsCtrl',
    ($scope, $translate, Server, $timeout) => {
      $scope.tableLoading = false;
      $scope.details = null;
      $scope.pageSizes = [5, 10, 15];
      $scope.titles = [
        $translate.instant(
          'server_tab_IP_antispam_details_information_table_header_ip',
        ),
        $translate.instant(
          'server_tab_IP_antispam_details_information_table_header_messageid',
        ),
        $translate.instant(
          'server_tab_IP_antispam_details_information_table_header_date',
        ),
        $translate.instant(
          'server_tab_IP_antispam_details_information_table_header_spamscore',
        ),
      ];
      $scope.elements = [
        '{{element.destinationIp}}',
        '{{element.messageId}}',
        "{{element.date|date:'short'}}",
        '{{element.spamscore}}',
      ];

      $scope.model = {
        block: $scope.currentActionData.block,
        ip: $scope.currentActionData.ip,
        id: $scope.currentActionData.id,
        search: null,
      };

      $scope.$watch(
        'model.search',
        (newValue) => {
          if ($scope.model.search !== null) {
            if ($scope.model.search === '') {
              $scope.$broadcast(
                'paginationServerSide.loadPage',
                1,
                'antispamDetails',
              );
            } else {
              $scope.searchLoading = true;
              $timeout(() => {
                if ($scope.model.search === newValue) {
                  $scope.$broadcast(
                    'paginationServerSide.loadPage',
                    1,
                    'antispamDetails',
                  );
                }
              }, 500);
            }
          }
        },
        true,
      );

      $scope.loadSpams = function loadSpams(count, offset) {
        $scope.tableLoading = true;
        Server.getIpSpamStats(
          $scope.model.block,
          $scope.model.ip,
          $scope.model.id,
          count,
          offset,
          $scope.model.search,
        )
          .then((stats) => {
            $scope.details = stats;
            $scope.tableLoading = false;
          })
          .catch((reason) => {
            $scope.tableLoading = false;
            $scope.resetAction();
            set(reason, 'type', 'INFO');
            $scope.setMessage(
              $translate.instant(
                'server_configuration_mitigation_auto_success',
              ),
              reason,
            );
          });
      };
    },
  );
