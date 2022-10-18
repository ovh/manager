import controller from './ip.controller';
import template from './ip.html';

const allowByoipFeatureName = 'ip:byoip';

export const listRouting = {
  reloadOnSearch: false,
  resolve: {
    goToDashboard: /* @ngInject */ ($state) => () =>
      $state.go('app.ip.dashboard'),
    goToAntispam: /* @ngInject */ ($state) => (ip) =>
      $state.go('app.ip.dashboard.ip.antispam', {
        ip: ip.ip,
      }),
    goToFirewall: /* @ngInject */ ($state) => (ip) =>
      $state.go('app.ip.dashboard.ip.firewall', {
        ip: ip.ip,
      }),
    goToGameFirewall: /* @ngInject */ ($state) => (ip) =>
      $state.go('app.ip.dashboard.ip.game-firewall', {
        ip: ip.ip,
      }),
    goToAgoraOrder: /* @ngInject */ ($state, trackPage) => () => {
      trackPage('order');
      return $state.go('app.ip.agora-order');
    },
    goToByoipConfiguration: /* @ngInject */ ($state, trackClick) => () => {
      trackClick('bring-your-own-ip');
      return $state.go('app.ip.byoip');
    },
    breadcrumb: () => null,
    hideBreadcrumb: () => true,
    orderIpAvailable: /* @ngInject */ (coreConfig, ovhFeatureFlipping) => {
      const universe = coreConfig.getUniverse() === 'server' ? 'server' : 'hpc';
      return ovhFeatureFlipping
        .checkFeatureAvailability(`ip:order:${universe}`)
        .then((featureAvailability) =>
          featureAvailability.isFeatureAvailable(`ip:order:${universe}`),
        );
    },
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip', {
    url: '/ip?serviceType&page&pageSize',
    template,
    controller,
    reloadOnSearch: false,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('hasAnyIp')
        .then((hasAnyIp) => `app.ip.${hasAnyIp ? 'dashboard' : 'onboarding'}`),
    resolve: {
      hasAnyIp: /* @ngInject */ (iceberg) =>
        iceberg('/ip')
          .query()
          .expand('CachedObjectList-Pages')
          .limit(1)
          .execute(null, true)
          .$promise.then(({ data: [ip] }) => !!ip),
      trackingPrefix: () => 'dedicated::ip::dashboard',
      trackPage: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackPage({
          name: `${trackingPrefix}::${hit}`,
        });
      },
      trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (
        hit,
        { chapter1, usePrefix = true } = {},
      ) => {
        atInternet.trackClick({
          name: `${usePrefix ? `${trackingPrefix}::` : ''}${hit}`,
          type: 'action',
          chapter1,
        });
      },
      dashboardLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.dashboard', $transition$.params()),
      failoverLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.failover', $transition$.params()),
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
        return $state.go('app.ip.agora-order');
      },
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('ip_ip'),
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard',
    },
  });

  $stateProvider.state('app.ip.dashboard.ip', {
    url: '/:ip',
    redirectTo: 'app.ip.dashboard',
    resolve: {
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
      breadcrumb: /* @ngInject */ (ip) => ip,
    },
  });
};
