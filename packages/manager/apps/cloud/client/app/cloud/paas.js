/**
 *  Two main sections (IaaS and PaaS)
 */
angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('paas', {
    url: '/paas',
    abstract: true,
    template: '<ui-view/>',
    translations: {
      value: ['../common', '.'],
      format: 'json',
    },
  });
});
