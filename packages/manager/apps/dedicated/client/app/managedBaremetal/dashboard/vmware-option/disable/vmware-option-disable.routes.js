export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.dashboard.vmware-option-disable', {
    url: '/vmware-option-disable',
    params: {
      option: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccVmwareOptionDisable',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      option: /* @ngInject */ ($transition$) => $transition$.params().option,
    },
  });
};
