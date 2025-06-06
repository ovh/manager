export default /* @ngInject */ function XdslModemWifiActivationStateCtrl() {
  const self = this;

  self.getActivationClass = () => ({
    'text-success oui-icon-success-circle': self.activationState,
    'text-danger oui-icon-error-circle': !self.activationState,
  });
}
