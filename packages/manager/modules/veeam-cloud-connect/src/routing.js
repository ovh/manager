import template from './template.html';
import headerTemplate from './header/veeam-dashboard-header.html';
import headerCtrl from './header/veeam-dashboard-header.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('veeam-cloud-connect', {
      url: '/paas/veeam',
      abstract: true,
      template,
      translations: {
        value: ['.'],
        format: 'json',
      },
    })
    .state('veeam-cloud-connect.detail', {
      url: '/{serviceName}',
      views: {
        veeamContainer: {
          component: 'ovhManagerVeeamCloudConnectComponent',
        },
      },
      resolve: {
        serviceName: /* @ngInject */ $transition$ => $transition$.params().serviceName,
        goToDashboard: /* @ngInject */ ($state, serviceName) => () => $state.go('veeam-cloud-connect.detail.dashboard', {
          serviceName,
        }),
        goToStorage: /* @ngInject */ ($state, serviceName) => () => $state.go('veeam-cloud-connect.detail.storage', {
          serviceName,
        }),
        goToStorageAdd: /* @ngInject */ ($state, serviceName) => () => $state.go('veeam-cloud-connect.detail.storage.add', {
          serviceName,
        }),
        goToStorageQuota: /* @ngInject */ ($state, serviceName) => inventoryName => $state.go('veeam-cloud-connect.detail.storage.quota', {
          inventoryName,
          serviceName,
        }),
        goToOfferChange: /* @ngInject */ ($state, serviceName) => () => $state.go('veeam-cloud-connect.detail.dashboard.update-offer', {
          serviceName,
        }),
      },
    })
    .state('veeam-cloud-connect.detail.dashboard', {
      url: '/dashboard',
      views: {
        veeamHeader: {
          template: headerTemplate,
          controller: headerCtrl,
          controllerAs: 'VeeamCloudConnectDashboardHeaderCtrl',
        },
        veeamContent: {
          component: 'ovhManagerVeeamCloudConnectDashboardComponent',
        },
      },
      translations: {
        value: ['.', './dashboard', './storage/add', './dashboard/update-offer'],
        format: 'json',
      },
    })
    .state('veeam-cloud-connect.detail.dashboard.update-offer', {
      url: '/update-offer',
      views: {
        modal: {
          component: 'ovhManagerVeeamCloudConnectUpdateOfferComponent',
        },
      },
      layout: 'modal',
    })
    .state('veeam-cloud-connect.detail.storage', {
      url: '/storage',
      views: {
        veeamHeader: {
          template: headerTemplate,
          controller: headerCtrl,
          controllerAs: 'VeeamCloudConnectDashboardHeaderCtrl',
        },
        veeamContent: {
          component: 'ovhManagerVeeamCloudConnectStorageComponent',
        },
      },
      translations: {
        value: ['.', './storage', './storage/add'],
        format: 'json',
      },
    })
    .state('veeam-cloud-connect.detail.storage.add', {
      url: '/add',
      views: {
        modal: {
          component: 'ovhManagerVeeamCloudConnectStorageAddComponent',
        },
      },
      layout: 'modal',
    })
    .state('veeam-cloud-connect.detail.storage.quota', {
      url: '/quota/{inventoryName}',
      views: {
        modal: {
          component: 'ovhManagerVeeamCloudConnectStorageQuotaComponent',
        },
      },
      layout: 'modal',
      resolve: {
        inventoryName: /* @ngInject */ $transition$ => $transition$.params().inventoryName,
      },
    });
};
