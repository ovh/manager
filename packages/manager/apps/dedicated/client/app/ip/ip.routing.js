import controller from './ip.controller';
import template from './ip.html';

import {
  TRACKING_PREFIX,
  REPRICING_BANNER_URL,
  REPRICING_BANNER_DATE_MIN,
  REPRICING_BANNER_DATE_MAX,
  REPRICING_BANNER_DATE_CREATION,
  IP_SERVICE_PATH,
} from './ip.constant';

const allowByoipFeatureName = 'ip:byoip';
const allowDeleteByoipService = 'ip:deleteByoipService';

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
    goToStatistics: /* @ngInject */ ($state) => (ipBlock) => {
      $state.go('network-security.scrubbing-center', { ip: ipBlock.ipBlock });
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
    url:
      '/ip?action&ip&serviceName&serviceType&page&pageSize&ipBlock&ipService&ipTypeFilter',
    template,
    controller,
    reloadOnSearch: false,
    redirectTo: (transition) => {
      const { serviceName, ...params } = transition.params();
      if (serviceName?.match(/^(ip|byoip-failover)-[\d./]+$/)) {
        return {
          state: 'app.ip',
          params: { ...params, ipService: serviceName },
        };
      }
      return transition
        .injector()
        .getAsync('hasAnyIp')
        .then((hasAnyIp) => `app.ip.${hasAnyIp ? 'dashboard' : 'onboarding'}`);
    },
    resolve: {
      fetchFirstIp: /* @ngInject */ ($http) => (params = '') =>
        $http
          .get(`/ip${params ? `?${params}` : ''}`)
          .then(({ data }) => data?.[0]),
      hasAnyIp: /* @ngInject */ (fetchFirstIp) =>
        fetchFirstIp().then((ip) => !!ip),
      hasAnyUnusedIp: /* @ngInject */ (fetchFirstIp) =>
        fetchFirstIp('routedTo.serviceName=null').then((ip) => !!ip),
      isRepricingBannerShown: /* @ngInject */ ($q, hasAnyIp, iceberg) => {
        if (
          !hasAnyIp ||
          !moment().isBetween(
            REPRICING_BANNER_DATE_MIN,
            REPRICING_BANNER_DATE_MAX,
          )
        ) {
          return $q.when(false);
        }
        return iceberg('/services')
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('route.path', 'eq', IP_SERVICE_PATH)
          .addFilter(
            'billing.lifecycle.current.creationDate',
            'lt',
            moment(REPRICING_BANNER_DATE_CREATION).toISOString(),
          )
          .limit(1)
          .execute()
          .$promise.then(({ data: [ip] }) => !!ip);
      },
      openBannerRepricePage: (coreConfig) => () =>
        window.open(
          REPRICING_BANNER_URL[coreConfig.getUser().ovhSubsidiary] ||
            REPRICING_BANNER_URL.DEFAULT,
          '_blank',
          'noopener',
        ),
      ipServiceData: /* @ngInject */ ($transition$, $http) => {
        const { ipService } = $transition$.params();
        if (!ipService) {
          return null;
        }
        return $http
          .get(`/ip/service/${encodeURIComponent(ipService)}`)
          .then(({ data }) => data)
          .catch(() => null);
      },
      trackPage: /* @ngInject */ (atInternet) => (...hits) => {
        atInternet.trackPage({
          name: [TRACKING_PREFIX, ...hits].join('::'),
        });
      },
      trackClick: /* @ngInject */ (atInternet) => (...hits) => {
        atInternet.trackClick({
          name: [TRACKING_PREFIX, ...hits].join('::'),
          type: 'action',
        });
      },
      ipLbLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('app.ip.dashboard.iplb', $transition$.params()),
      goToOrganisation: /* @ngInject */ ($state) => () =>
        $state.go('app.ip.organisation'),
      goToVrack: /* @ngInject */ ($state) => (vrackId) =>
        $state.go('vrack.dashboard', { vrackId }),
      isByoipAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(allowByoipFeatureName)
          .then((feature) => feature.isFeatureAvailable(allowByoipFeatureName)),
      isDeleteByoipServiceAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(allowDeleteByoipService)
          .then((feature) =>
            feature.isFeatureAvailable(allowDeleteByoipService),
          ),
      goToByoipConfiguration: /* @ngInject */ ($state) => () => {
        return $state.go('app.ip.byoip');
      },
      goToAgoraOrder: /* @ngInject */ ($state, trackPage) => () => {
        trackPage('order');
        return $state.go('app.ip.agora-order');
      },
      goToOrReload: /* @ngInject */ ($state) => (state, params = {}) =>
        $state.go(state, params, {
          reload: $state.includes(state) ? state : false,
          inherit: false,
        }),
      goToDashboard: /* @ngInject */ (goToOrReload) => () =>
        goToOrReload('app.ip.dashboard'),
      goToFailover: /* @ngInject */ (goToOrReload) => ({ unused = '0' } = {}) =>
        goToOrReload('app.ip.failover', { unused }),
      isDashboardActive: /* @ngInject */ ($state) => () =>
        $state.includes('app.ip.dashboard'),
      isFailoverActive: /* @ngInject */ ($state, $location) => ({
        unused = null,
      } = {}) =>
        $state.includes('app.ip.failover') &&
        (unused === null || $location.search().unused === unused),
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('ip_ip'),
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
