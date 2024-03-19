import controller from './domain-zone-dns.controller';
import template from './domain-zone-dns.html';

const commonResolveForZoneHistory = {
  goToZoneHistory: /* @ngInject */ ($state) => (params) =>
    $state.go('app.domain.product.zone-history', params),
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};
const commonResolve = {
  goToZoneHistory: /* @ngInject */ ($state) => (params) =>
    $state.go('app.domain.product.zone-history', params),
  breadcrumb: /* @ngInject */ ($translate) => $translate.instant('domain_zone'),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.zone-history', {
    url: '/zone-history',
    views: {
      domainView: {
        component: 'domainZoneDashboardHistory',
      },
    },
    resolve: {
      ...commonResolveForZoneHistory,
      goToDnsData: /* @ngInject */ ($state) => (url) =>
        $state.go('app.domain.product.zone-history.view', { url }),
      goToDnsRestore: /* @ngInject */ ($state) => (url, chosenDate) =>
        $state.go('app.domain.product.zone-history.restore', {
          url,
          chosenDate,
        }),
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone'),
      goToDiffViewer: /* @ngInject */ ($state) => (
        dnsEntriesForComparison,
        zoneName,
      ) =>
        $state.go('app.domain.product.diff-tool-viewer', {
          selectedDates: dnsEntriesForComparison
            .filter(({ active }) => active)
            .map(({ date }) => date),
          productId: zoneName,
        }),
    },
    params: {
      productId: null,
    },
  });

  $stateProvider.state('app.domain.product.diff-tool-viewer', {
    url: '/diff-tool-viewer',
    views: {
      domainView: {
        component: 'domainZoneDiffToolViewerHistory',
      },
    },
    resolve: {
      ...commonResolveForZoneHistory,
      goBack: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.domain.product.zone-history', {
          productId: $transition$.params().productId,
        }),
    },
    params: {
      selectedDates: null,
      productId: null,
    },
  });

  $stateProvider.state('app.domain.product.zone-history.view', {
    url: '/view',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'zoneHistoryView',
      },
    },
    params: {
      url: {
        type: 'string',
        value: null,
        description: 'url used to retrieve the zone data file',
      },
    },
    resolve: {
      ...commonResolveForZoneHistory,
      url: /* @ngInject */ ($transition$) => $transition$.params().url,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      getDnsZoneData: /* @ngInject */ (DNSZoneService) => (url) =>
        DNSZoneService.getDnsFile(url),
    },
  });

  $stateProvider.state('app.domain.product.zone-history.restore', {
    url: '/restore',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'zoneHistoryRestore',
      },
    },
    params: {
      chosenDate: {
        type: 'string',
        value: null,
      },
    },
    resolve: {
      ...commonResolveForZoneHistory,
      chosenDate: /* @ngInject */ ($transition$) =>
        $transition$.params().chosenDate,
      zoneId: /* @ngInject */ ($transition$) => $transition$.params().productId,
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go('^', {
          reload,
        });
        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(
                `alert-${type}`,
                message,
                null,
                'history.dashboard.alerts.global',
              ),
            ),
          );
        }
        return promise;
      },
    },
  });

  $stateProvider.state('app.domain.product.zone', {
    url: '/zone',
    views: {
      domainView: {
        template,
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
      },
    },
    atInternet: {
      rename: 'ZONE',
    },
    resolve: {
      ...commonResolve,
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone.activate'),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('app.domain.product.zone', null, {
          reload,
        });

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
    },
  });

  $stateProvider.state('app.alldom.domain.zone', {
    url: '/zone',
    views: {
      domainView: {
        template,
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
      },
    },
    atInternet: {
      rename: 'ZONE',
    },
    resolve: {
      ...commonResolve,
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.alldom.domain.zone.activate'),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state) => () =>
        $state.go('app.alldom.domain.zone'),
    },
  });
};
