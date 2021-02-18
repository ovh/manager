/**
 *  Two main sections (IaaS and PaaS)
 */
angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('iaas', {
    url: '/iaas',
    abstract: true,
    resolve: {
      connectedUser: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
    },
    template: '<ui-view/>',
    translations: {
      format: 'json',
      value: ['../common', '.'],
    },
  });
});
