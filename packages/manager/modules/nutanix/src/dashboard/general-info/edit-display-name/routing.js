export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info.edit-display-name', {
    url: '/edit-display-name',
    component: 'nutanixGeneralInfoEditDisplayNameComponent',
    layout: 'modal',
    params: {
      displayName: null,
    },
    resolve: {
      displayName: /* @ngInject */ ($transition$) =>
        $transition$.params().displayName,
      goBack: /* @ngInject */ (goToNutanixGeneralInfo) =>
        goToNutanixGeneralInfo,
      handleError: /* @ngInject */ (Alerter, goBack) => (error) => {
        Alerter.error(
          error.message || error.data?.message,
          'nutanix_dashboard_alert',
        );
        goBack();
      },
      handleSuccess: /* @ngInject */ ($rootScope, serviceName, goBack) => (
        message,
        name,
      ) => {
        $rootScope.$broadcast('global_display_name_change', {
          stateParams: {
            serviceName,
          },
          displayName: name,
        });
        goBack(message);
      },
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'hpc::nutanix::dashboard::general-info::edit-display-name',
    },
  });
};
