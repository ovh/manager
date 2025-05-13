import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyLineAssistTroubleshootingAutoConfigCtrl(
  $q,
  troubleshootingProcess,
  tucValidator,
  OvhApiMyIp,
) {
  const self = this;

  self.loading = {
    init: false,
    resetConfig: false,
  };

  self.model = {
    ip: null,
  };

  self.process = null;
  self.step = null;
  self.myIpInfos = null;
  self.validator = null;
  self.status = 'CHECKIP';
  self.resetConfigError = null;
  self.resetConfigResult = null;

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.startAutoConfig = function startAutoConfig() {
    self.resetConfigError = null;
    self.resetConfigResult = null;

    self.loading.resetConfig = true;

    return self.process.line.phone
      .resetConfig(self.model.ip)
      .then((resetResult) => {
        self.status = 'OK';
        self.step.isFinalized = true;
        self.resetConfigResult = resetResult;
      })
      .catch((error) => {
        self.resetConfigError = error;
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.resetConfig = false;
      });
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
    self.loading.init = true;
    self.process = troubleshootingProcess;
    self.step = self.process.activeStep;
    self.validator = tucValidator;

    return $q
      .all({
        myIp: OvhApiMyIp.Aapi().get().$promise,
        lineIp: self.process.line.getIps(),
      })
      .then((responses) => {
        self.myIpInfos = get(responses, 'myIp[0]');
        self.model.ip = get(responses, 'lineIp[0].ip');
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
