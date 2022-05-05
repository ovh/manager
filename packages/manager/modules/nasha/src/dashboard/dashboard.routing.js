export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard', {
    url: '/:serviceName',
    component: 'nashaDashboard',
    redirectTo: 'nasha.dashboard.general-information',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      goBack: /* @ngInject */ (
        $state,
        serviceName,
        alertSuccess,
        alertError,
      ) => ({ success, error, stateName = '', reload = false } = {}) =>
        $state
          .go(
            stateName || '^',
            { serviceName },
            { reload: reload || !!success },
          )
          .then((result) => {
            if (success) {
              alertSuccess(success);
            }
            if (error) {
              alertError(error);
            }
            return result;
          }),
      goToGeneralInformation: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('nasha.dashboard.general-information', { serviceName }),
      goToPartitions: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('nasha.dashboard.partitions', { serviceName }),
      nasha: /* @ngInject */ (
        OvhApiDedicatedNasha,
        serviceName,
        prepareNasha,
      ) => {
        const aapi = OvhApiDedicatedNasha.Aapi();
        aapi.resetCache();
        return aapi.get({ serviceName }).$promise.then(prepareNasha);
      },
      reload: /* @ngInject */ ($state, goBack) => ({ success, error }) =>
        goBack({
          stateName: $state.current.name,
          reload: true,
          success,
          error,
        }),
      serviceInfo: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/dedicated/nasha/${serviceName}/serviceInfos`)
          .then(({ data }) => data),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
  });
};
