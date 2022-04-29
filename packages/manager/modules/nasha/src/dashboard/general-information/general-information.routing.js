export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.general-information', {
    url: '/',
    component: 'nashaDashboardGeneralInformation',
    resolve: {
      breadcrumb: () => null,
      goToEditName: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('nasha.dashboard.general-information.edit-name', {
          serviceName,
        }),
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
    },
  });
};
