export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.dashboard.edit-display-name',
    {
      url: '/edit-display-name',
      component: 'managerDedicatedClusterDashboardEditDisplayNameComponent',
      layout: 'modal',
      params: {
        displayName: null,
      },
      resolve: {
        displayName: /* @ngInject */ ($transition$) =>
          $transition$.params().displayName,
        goBack: /* @ngInject */ (goToClusterGeneralInfo) =>
          goToClusterGeneralInfo,
        handleError: /* @ngInject */ (Alerter, goBack) => (error) => {
          Alerter.error(
            error.data?.message || error.message || error,
            'cluster_dashboard_alert',
          );
          goBack();
        },
        handleSuccess: /* @ngInject */ ($rootScope, displayName, goBack) => (
          message,
          name,
        ) => {
          $rootScope.$broadcast('global_display_name_change', {
            stateParams: {
              displayName,
            },
            displayName: name,
          });
          goBack(message);
        },
        breadcrumb: () => null,
      },
    },
  );
};
