import last from 'lodash/last';

export default /* @ngInject */ function TelecomTelephonyLineAssistTroubleshootingManualConfigCtrl(
  troubleshootingProcess,
  tucValidator,
) {
  const self = this;

  self.model = {
    privateIp: null,
  };

  self.process = null;
  self.step = null;
  self.validator = null;
  self.status = 'CHECKIP';

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.getWebInterfaceAddress = function getWebInterfaceAddress() {
    if (self.process.line.phone.brand === 'phone.cisco.spa112') {
      return `http://${self.model.privateIp}`;
    }
    switch (self.process.phoneType) {
      case 'lg':
        return `http://${self.model.privateIp}:8000`;
      case 'thomson':
        return `http://${self.model.privateIp}/admin.html`;
      default:
        return `http://${self.model.privateIp}/admin/advanced`;
    }
  };

  self.getServerAddress = function getServerAddress() {
    if (self.process.line.phone.brand === 'phone.thomson.st2030') {
      return 'th.prov.voip.ovh.net/st2030';
    }

    // TODO : add other conditions for other thomson phones (if some)
    return 'th.prov.voip.ovh.net/tb30';
  };

  self.getWebInterfaceImageName = function getWebInterfaceImageName() {
    if (self.process.line.phone.brand === 'phone.cisco.spa112') {
      return 'cisco_spa112_1';
    }
    switch (self.process.phoneType) {
      case 'lg':
        return 'lg_1';
      case 'cisco':
        return 'cisco_spa5xx_1';
      case 'linksys':
        return 'linksys_pap2t_1';
      default:
        return '';
    }
  };

  self.getConfigurationPageImageName = function getConfigurationPageImageName() {
    if (self.process.line.phone.brand === 'phone.cisco.spa112') {
      return 'cisco_spa112_2';
    }
    switch (self.process.phoneType) {
      case 'lg':
        return 'lg_2';
      case 'cisco':
        return 'cisco_spa5xx_2';
      case 'linksys':
        return 'linksys_pap2t_2';
      default:
        return '';
    }
  };

  self.getLgModel = function getLgModel() {
    return last(self.process.line.phone.brand.split('.'));
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.continueManualConfig = function continueManualConfig() {
    self.status = 'OK';
    self.step.isFinalized = true;
  };

  self.resetIp = function resetIp() {
    self.status = 'CHECKIP';
    self.step.isFinalized = false;
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.process = troubleshootingProcess;
    self.step = self.process.activeStep;
    self.validator = tucValidator;
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
