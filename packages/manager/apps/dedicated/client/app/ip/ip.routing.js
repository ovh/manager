import controller from './ip.controller';
import template from './ip.html';

const allowByoipFeatureName = 'ip:byoip';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip', {
    url: '/ip?serviceName&page&pageSize',
    template,
    controller,
    reloadOnSearch: false,
    redirectTo: 'app.ip.dashboard',
    resolve: {
      trackingPrefix: () => 'dedicated::ip::dashboard',
      trackPage: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackPage({
          name: `${trackingPrefix}::${hit}`,
        });
      },
      trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackClick({
          name: `${trackingPrefix}::${hit}`,
          type: 'action',
        });
      },
      dashboardLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.dashboard', $transition$.params()),
      ipLbLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.dashboard.iplb', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToOrganisation: /* @ngInject */ ($state) => () =>
        $state.go('app.ip.dashboard.organisation'),
      isByoipAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(allowByoipFeatureName)
          .then((feature) => feature.isFeatureAvailable(allowByoipFeatureName)),
      goToByoipConfiguration: /* @ngInject */ ($state, trackClick) => () => {
        trackClick('bring-your-own-ip');
        return $state.go('app.ip.byoip');
      },
      goToAgoraOrder: /* @ngInject */ ($state, trackPage) => () => {
        trackPage('order');
        return $state.go('app.ip.dashboard.agora-order');
      },
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('ip_ip'),
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard',
    },
  });
};
