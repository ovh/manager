angular.module('managerApp').config(
  /* @ngInject */ ($locationProvider) => {
    $locationProvider.hashPrefix('');
  },
);
