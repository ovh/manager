import { TRACKING_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info.redeploy.confirm', {
    url: '',
    views: {
      modal: {
        component: 'nutanixDashboardGeneralInfoRedeployConfirmComponent',
      },
    },
    params: {
      redeployMethod: null,
      redeployConfig: null,
    },
    layout: 'modal',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      redeployMethod: /* @ngInject */ ($transition$) =>
        $transition$.params().redeployMethod,
      redeployConfig: /* @ngInject */ ($transition$) =>
        $transition$.params().redeployConfig,
      breadcrumb: () => null,
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.general-info.redeploy'),
    },
    atInternet: {
      rename: TRACKING_PREFIX,
    },
  });
};
