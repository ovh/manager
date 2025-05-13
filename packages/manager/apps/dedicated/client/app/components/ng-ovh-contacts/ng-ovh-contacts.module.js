angular.module('App').config(
  /* @ngInject */ (ovhContactsProvider, coreConfigProvider) => {
    ovhContactsProvider.setTarget(coreConfigProvider.getRegion());
  },
);
