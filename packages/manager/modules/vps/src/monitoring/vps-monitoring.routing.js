import component from './vps-monitoring.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.monitoring', {
    url: '/monitoring',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_monitoring'),
    },
  });
};
