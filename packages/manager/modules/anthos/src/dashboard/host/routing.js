import { TRACKING_PREFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host', {
    url: '/host',
    views: {
      anthosTenantView: 'anthosHost',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_host'),

      goToHost: /* @ngInject */ (goToState, serviceName) => (message, type) =>
        goToState('anthos.dashboard.host', { serviceName }, message, type),

      goToReinstallHost: /* @ngInject */ ($state, serviceName) => (host) =>
        $state.go('anthos.dashboard.host.reinstall', { serviceName, host }),

      goToRemoveHost: /* @ngInject */ ($state, serviceName) => (host) =>
        $state.go('anthos.dashboard.host.remove', { serviceName, host }),

      goToRestartHost: /* @ngInject */ ($state, serviceName) => (host) =>
        $state.go('anthos.dashboard.host.restart', { serviceName, host }),

      goToSetStateHost: /* @ngInject */ ($state, serviceName) => (host) =>
        $state.go('anthos.dashboard.host.set-state', { serviceName, host }),

      hostHitTracking: () => {
        return 'hosts';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::hosts`,
    },
  });
};
