import template from './template.html';
import dashboardTemplate from '../dashboard/template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('veeam-enterprise.details', {
      url: '/{serviceName}',
      redirectTo: 'veeam-enterprise.details.dashboard',
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
          $state.go('veeam-enterprise.details.dashboard'),
        goToLicenseActivate: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.details.dashboard.license.activate'),
        goToLicenseUpdate: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.details.dashboard.license.update'),
        goToLicenseTerminate: /* @ngInject */ ($state) => () =>
          $state.go('veeam-enterprise.details.dashboard.license.terminate'),
        breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      },
    })
    .state('veeam-enterprise.details.dashboard', {
      url: '/dashboard',
      views: {
        veeamEnterpriseContent: {
          template: dashboardTemplate,
          controller: 'VeeamEnterpriseDashboardCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: {
        value: ['../dashboard'],
        format: 'json',
      },
      resolve: {
        breadcrumb: () => null,
      },
    })
    .state('veeam-enterprise.details.dashboard.license', {
      url: '/license',
      abstract: true,
    })
    .state('veeam-enterprise.details.dashboard.license.activate', {
      url: '/activate',
      views: {
        modal: {
          component: 'veeamEnterpriseLicense',
        },
      },
      layout: 'modal',
      resolve: {
        action: () => 'register',
        breadcrumb: () => null,
      },
    })
    .state('veeam-enterprise.details.dashboard.license.update', {
      url: '/update',
      views: {
        modal: {
          component: 'veeamEnterpriseLicense',
        },
      },
      layout: 'modal',
      resolve: {
        action: () => 'update',
        breadcrumb: () => null,
      },
    })
    .state('veeam-enterprise.details.dashboard.license.terminate', {
      url: '/terminate',
      views: {
        modal: {
          component: 'veeamEnterpriseLicenseTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    });
};
