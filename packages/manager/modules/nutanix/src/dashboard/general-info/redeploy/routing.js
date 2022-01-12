import { TRACKING_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.general-info.redeploy', {
    url: '/redeploy',
    views: {
      'nodeView@nutanix.dashboard': {
        component: 'nutanixDashboardGeneralInfoRedeployComponent',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* @ngInject */ (goToNutanixGeneralInfo) =>
        goToNutanixGeneralInfo,
      goToConfirmRedeploy: /* @ngInject */ ($state) => (
        redeployMethod,
        config,
      ) =>
        $state.go('nutanix.dashboard.general-info.redeploy.confirm', {
          redeployMethod,
          redeployConfig: config,
        }),
      breadcrumb: ($translate) => $translate.instant('nutanix_redeploy_title'),
    },
    atInternet: {
      rename: TRACKING_PREFIX,
    },
  });
};
