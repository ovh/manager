import template from './template.html';
import dashboardTemplate from '../dashboard/template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('veeam-enterprise', {
      url: '/paas/veeam-enterprise/{serviceName}',
      redirectTo: 'veeam-enterprise.dashboard',
      template,
      controller: 'VeeamEnterpriseCtrl',
      controllerAs: '$ctrl',
      translations: {
        value: ['../common', '.'],
        format: 'json',
      },
      resolve: {
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        goToDashboard: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.dashboard'),
        goToLicenseActivate: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.dashboard.license.activate'),
        goToLicenseUpdate: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.dashboard.license.update'),
        goToLicenseTerminate: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.dashboard.license.terminate'),
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
        value: ['./dashboard'],
        format: 'json',
      },
    })
    .state('veeam-enterprise.dashboard.license', {
      url: '/license',
      abstract: true,
    })
    .state('veeam-enterprise.dashboard.license.activate', {
      url: '/activate',
      views: {
        modal: {
          component: 'veeamEnterpriseLicense',
        },
      },
      layout: 'modal',
      resolve: {
        action: () => 'register',
      },
    })
    .state('veeam-enterprise.dashboard.license.update', {
      url: '/update',
      views: {
        modal: {
          component: 'veeamEnterpriseLicense',
        },
      },
      layout: 'modal',
      resolve: {
        action: () => 'update',
      },
    })
    .state('veeam-enterprise.dashboard.license.terminate', {
      url: '/terminate',
      views: {
        modal: {
          component: 'veeamEnterpriseLicenseTerminate',
        },
      },
      layout: 'modal',
    });
};
