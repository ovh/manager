export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.internet-access', {
    url: '',
    abstract: true,
    views: {
      'packView@telecom.packs': {
        component: 'telecomPackInternetAccess',
      },
    },
  });
};
