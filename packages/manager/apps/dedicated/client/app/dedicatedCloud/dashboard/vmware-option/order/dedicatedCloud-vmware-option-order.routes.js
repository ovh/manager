export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.dashboard.vmware-option-order',
    {
      url: '/vmware-option-order',
      params: {
        option: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPccVmwareOptionOrder',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
        option: /* @ngInject */ ($transition$) => $transition$.params().option,
        breadcrumb: () => null,
      },
    },
  );
};
