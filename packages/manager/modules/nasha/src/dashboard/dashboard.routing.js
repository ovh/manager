export default /* @ngInject */ ($stateProvider) => {
  const dashboardStateName = 'nasha.dashboard';
  const editNameStateName = `${dashboardStateName}.edit-name`;

  $stateProvider.state(dashboardStateName, {
    url: '/:serviceName',
    component: 'nashaDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      currentHref: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(dashboardStateName, { serviceName }),
      editNameHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(editNameStateName, { serviceName }),
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
      goToEditName: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(`${dashboardStateName}.edit-name`, { serviceName }),
      goToPartitions: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(`${dashboardStateName}.partitions`, { serviceName }),
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
      schema: /* @ngInject */ ($http) =>
        $http.get('/dedicated/nasha.json').then(({ data }) => data),
      serviceInfo: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/dedicated/nasha/${serviceName}/serviceInfos`)
          .then(({ data }) => data),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
    },
  });
};
