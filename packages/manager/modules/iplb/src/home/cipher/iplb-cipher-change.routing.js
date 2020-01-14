export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.home.cipher', {
    url: '/cipher',
    views: {
      modal: {
        component: 'iplbCipherChange',
      },
    },
    layout: 'modal',
  });
};
