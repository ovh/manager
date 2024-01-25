const commonResolves = {
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.zone-history.diff-tool-viewer', {
    url: '/diff-tool-viewer',
    views: {
      'dnsZoneView@app.zone.details': {
        component: 'domainZoneDiffToolViewerHistory',
      },
    },
    resolve: {
      ...commonResolves,
      goBack: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.zone.details.zone-history', {
          productId: $transition$.params().productId,
        }),
    },
    params: {
      selectedDates: null,
      productId: null,
    },
  });
  $stateProvider.state('app.zone.details.zone-history.view', {
    url: '/view',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'zoneHistoryView',
      },
    },
    params: {
      isCurrentDnsZone: {
        type: 'bool',
        value: null,
      },
      url: {
        type: 'string',
        value: null,
        description: 'url used to retrieve the zone data file',
      },
      creationDate: {
        type: 'string',
        value: null,
      },
    },
    resolve: {
      url: /* @ngInject */ ($transition$) => $transition$.params().url,
      isCurrentDnsZone: /* @ngInject */ ($stateParams) =>
        $stateParams.isCurrentDnsZone,
      creationDate: /* @ngInject */ ($stateParams) => $stateParams.creationDate,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      getDnsZoneData: /* @ngInject */ (DNSZoneService) => (url) =>
        DNSZoneService.getDnsFile(url),
      goToDnsRestore: /* @ngInject */ ($state) => (url, chosenDate) =>
        $state.go('app.zone.details.zone-history.restore', {
          url,
          chosenDate,
        }),
    },
  });
  $stateProvider.state('app.zone.details.zone-history.restore', {
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
      chosenDate: /* @ngInject */ ($stateParams) => $stateParams.chosenDate,
      zoneId: /* @ngInject */ ($stateParams) => $stateParams.productId,
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
  $stateProvider.state('app.zone.details.zone-history', {
    url: '/zone-history',
    views: {
      'dnsZoneView@app.zone.details': {
        component: 'domainZoneDashboardHistory',
      },
    },
    resolve: {
      ...commonResolves,
      goToDnsData: /* @ngInject */ ($state) => (
        url,
        creationDate,
        isCurrentDnsZone,
      ) =>
        $state.go('app.zone.details.zone-history.view', {
          url,
          creationDate,
          isCurrentDnsZone,
        }),
      goToDnsRestore: /* @ngInject */ ($state) => (url, chosenDate) =>
        $state.go('app.zone.details.zone-history.restore', {
          url,
          chosenDate,
        }),
      goBack: /* @ngInject */ ($state, $stateParams) => () =>
        $state.go('app.zone.details.dashboard', $stateParams),
      goToDiffViewer: /* @ngInject */ ($state) => (
        dnsEntriesForComparison,
        zoneName,
      ) =>
        $state.go('app.zone.details.zone-history.diff-tool-viewer', {
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
};
