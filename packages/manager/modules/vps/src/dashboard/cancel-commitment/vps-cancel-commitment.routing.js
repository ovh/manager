export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.cancel-commitment', {
    url: '/cancel-commitment',
    views: {
      modal: {
        component: 'billingCancelCommitment',
      },
    },
    layout: 'modal',
    resolve: {
      serviceId: /* @ngInject */ (serviceInfo) => serviceInfo.serviceId,
    },
  });
};
