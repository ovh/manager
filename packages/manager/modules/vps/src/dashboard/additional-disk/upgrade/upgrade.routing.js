export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.additional-disk-upgrade', {
    url: '/additional-disk-upgrade',
    views: {
      modal: {
        component: 'ovhManagerVpsComponentAdditionalDiskUpgrade',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
    atInternet: {
      rename: 'vps::detail::additional-disk::upgrade',
    },
  });
};
