export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.rename-service', {
    url: '/rename-service',
    views: {
      modal: {
        component: 'anthosDashboardRenameService',
      },
    },
    layout: 'modal',
    resolve: {
      breacrumb: () => false,
    },
  });
};
