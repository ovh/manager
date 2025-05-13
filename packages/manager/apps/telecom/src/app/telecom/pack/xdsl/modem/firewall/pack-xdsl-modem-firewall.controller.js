import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function XdslModemFirewallCtrl(
  $stateParams,
  $translate,
  $q,
  OvhApiXdsl,
  TucToast,
  TucPackXdslModemMediator,
) {
  const self = this;

  this.mediator = TucPackXdslModemMediator;

  this.changeFirewallLevel = function changeFirewallLevel() {
    if (
      isEmpty($stateParams.serviceName) ||
      !this.firewallCurrentLevelTmp ||
      !TucPackXdslModemMediator.capabilities.canChangeEasyFirewallLevel
    ) {
      this.firewallCurrentLevelTmp = this.firewallCurrentLevel;
      TucToast.error(
        $translate.instant('xdsl_modem_firewall_an_error_ocurred'),
      );
      return $q.reject();
    }
    return OvhApiXdsl.Modem()
      .v6()
      .update(
        {
          xdslId: $stateParams.serviceName,
        },
        {
          easyFirewallLevel: this.firewallCurrentLevelTmp.name,
        },
      )
      .$promise.then((data) => {
        TucPackXdslModemMediator.disableCapabilities();
        TucPackXdslModemMediator.setTask('changeModemConfigEasyFirewallLevel');
        self.firewallCurrentLevel = self.firewallCurrentLevelTmp;
        TucToast.success($translate.instant('xdsl_modem_firewall_doing'));
        return data;
      })
      .catch((err) => {
        self.firewallCurrentLevelTmp = self.firewallCurrentLevel;
        TucToast.error(
          $translate.instant('xdsl_modem_firewall_an_error_ocurred'),
        );
        return $q.reject(err);
      });
  };

  this.getDisplayValue = function getDisplayValue() {
    return TucPackXdslModemMediator.info.easyFirewallLevel
      ? TucPackXdslModemMediator.info.easyFirewallLevel
      : 'Normal';
  };

  const init = function init() {
    self.firewallLevels = [
      {
        name: 'BlockAll',
        label: 'xdsl_modem_firewall_level_blockall',
      },
      {
        name: 'Disabled',
        label: 'xdsl_modem_firewall_level_disabled',
      },
      {
        name: 'Normal',
        label: 'xdsl_modem_firewall_level_normal',
      },
    ];
    self.firewallCurrentLevel = find(self.firewallLevels, {
      name: self.getDisplayValue(),
    });
    self.firewallCurrentLevelTmp = self.firewallCurrentLevel;
  };

  init();
}
