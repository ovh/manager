import template from './template.html';
import dashboardTemplate from './dashboard/template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('veeam-enterprise', {
      abstract: true,
      url: '/paas/veeam-enterprise/{serviceName}',
      template,
      controller: 'VeeamEnterpriseCtrl',
      controllerAs: '$ctrl',
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
    })
    .state('veeam-enterprise.dashboard', {
      url: '/dashboard',
      views: {
        veeamEnterpriseContent: {
          template: dashboardTemplate,
          controller: 'VeeamEnterpriseDashboardCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../common', '.', './dashboard'],
        format: 'json',
      },
    });
};
