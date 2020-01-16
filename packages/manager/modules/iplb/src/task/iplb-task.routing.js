import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.task', {
    url: '/task',
    views: {
      iplbHeader: {
        template: IplbHeaderTemplate,
        controller: 'IpLoadBalancerDashboardHeaderCtrl',
        controllerAs: 'ctrl',
      },
      iplbContent: {
        component: 'ovhManagerIplbTaskComponent',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('network.iplb.detail.task'),
      goToTaskPreview: /* @ngInject */ ($state, serviceName) => (task) =>
        $state.go('network.iplb.detail.task.preview', { serviceName, task }),
    },
  });
};
