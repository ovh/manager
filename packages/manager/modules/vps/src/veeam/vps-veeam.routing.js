import component from './vps-veeam.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam', {
    url: '/veeam',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
    resolve: {
      goToVeeamRestore: /* @ngInject */ ($state) => (restorePoint) =>
        $state.go('vps.detail.veeam.restore', { restorePoint }),
      goToVeeamMount: /* @ngInject */ ($state) => (restorePoint, mount) =>
        $state.go('vps.detail.veeam.mount', { restorePoint, mount }),
      goBack: /* @ngInject */ ($state) => () => $state.go('vps.detail.veeam'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_veeam'),
    },
  });
};
