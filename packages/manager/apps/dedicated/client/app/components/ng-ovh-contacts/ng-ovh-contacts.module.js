angular.module('App').config((ovhContactsProvider, coreConfigProvider) => {
  ovhContactsProvider.setTarget(coreConfigProvider.getRegion());
});
