angular.module('App').config((ovhPaymentMethodProvider, coreConfigProvider) => {
  ovhPaymentMethodProvider.setTarget(coreConfigProvider.getRegion());
});
