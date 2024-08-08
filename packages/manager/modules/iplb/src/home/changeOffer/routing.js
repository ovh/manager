export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.detail.home.change-offer', {
    url: '/change-offer',
    views: {
      'iplbContent@iplb.detail': {
        component: 'iplbChangeOffer',
      },
    },
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'iplb.detail.home',
          {},
          reload ? { reload: 'iplb.detail.home' } : null,
        ),
    },
  });
};
