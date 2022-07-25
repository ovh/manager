import { MAX_PARTITIONS } from './dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  const dashboardStateName = 'nasha.dashboard';
  const editNameStateName = `${dashboardStateName}.edit-name`;

  $stateProvider.state(dashboardStateName, {
    url: '/:serviceName',
    component: 'nashaDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      canCreatePartitions: /* @ngInject */ (numberOfPartitions) =>
        numberOfPartitions < MAX_PARTITIONS,
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
      ) => ({ success, error, stateName, reload } = {}) => {
        const name = stateName || '^';
        const prms = { serviceName };
        const opts = {
          reload: reload === true || (Boolean(success) && reload !== false),
        };
        return $state.go(name, prms, opts).then((result) => {
          if (success) {
            alertSuccess(success);
          }
          if (error) {
            alertError(error);
          }
          return result;
        });
      },
      goToEditName: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(editNameStateName, { serviceName }),
      goToPartitionsCreate: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(`${dashboardStateName}.partitions.create`, { serviceName }),
      nasha: /* @ngInject */ (
        OvhApiDedicatedNasha,
        serviceName,
        prepareNasha,
      ) => {
        const aapi = OvhApiDedicatedNasha.Aapi();
        aapi.resetCache();
        return aapi.get({ serviceName }).$promise.then(prepareNasha);
      },
      nashaApiUrl: /* @ngInject */ (baseApiUrl, serviceName) =>
        `${baseApiUrl}/${serviceName}`,
      numberOfPartitions: /* @ngInject */ (nashaApiUrl, $http) =>
        $http.get(`${nashaApiUrl}/partition`).then(({ data }) => data.length),
      reload: /* @ngInject */ ($state, goBack) => ({ success, error } = {}) =>
        goBack({
          stateName: $state.current.name,
          reload: true,
          success,
          error,
        }),
      serviceInfo: /* @ngInject */ ($http, nashaApiUrl) =>
        $http.get(`${nashaApiUrl}/serviceInfos`).then(({ data }) => data),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      taskApiUrl: /* @ngInject */ (nashaApiUrl) => `${nashaApiUrl}/task`,
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
    },
  });
};
