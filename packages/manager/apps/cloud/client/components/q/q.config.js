angular.module('managerApp').config(
  /* @ngInject */ ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  },
);
