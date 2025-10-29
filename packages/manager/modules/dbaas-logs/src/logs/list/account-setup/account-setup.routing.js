const detailState = 'dbaas-logs.detail';

const redirectTo = (transition) => {
  const LogsConstants = transition.injector().get('LogsConstants');
  return transition
    .injector()
    .getAsync('service')
    .then(
      ({ state: serviceState, serviceName }) =>
        serviceState !== LogsConstants.SERVICE_STATE_TO_CONFIG && {
          state: detailState,
          params: { serviceName },
        },
    );
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.list.account-setup', {
    url: '/account-setup/{serviceName:[a-zA-Z0-9]+-[a-zA-Z0-9-]+}',
    redirectTo,
    views: {
      modal: { component: 'dbaasLogsAccountSetup' },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      hideBreadcrumb: () => true,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      service: /* @ngInject */ (LogsDetailService, serviceName) =>
        LogsDetailService.getServiceDetails(serviceName),
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      goToDetail: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(detailState, { serviceName }, { reload: true }),
    },
  });
};
