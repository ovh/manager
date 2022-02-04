import component from './vps-additional-disk.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk', {
    url: '/additional-disk',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_additional_disk'),

      goToOrderAdditionalDisk: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.additional-disk.order'),
    },
  });
};
