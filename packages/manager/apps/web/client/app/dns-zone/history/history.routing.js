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
      goBack: /* @ngInject */ ($state, $stateParams) => () =>
        $state.go('app.zone.details.zone-history', $stateParams),
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
      url: {
        type: 'string',
        value: null,
      },
    },
    resolve: {
      url: /* @ngInject */ ($stateParams) => $stateParams.url,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      getDnsZoneData: /* @ngInject */ (DNSZoneService) => (url) =>
        DNSZoneService.getDnsFile(url),
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
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
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
      goToDnsData: /* @ngInject */ ($state) => (url) =>
        $state.go('app.zone.details.zone-history.view', { url }),
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
            .filter((u) => u.active)
            .map((u) => u.date),
          productId: zoneName,
        }),
    },
    params: {
      productId: null,
    },
  });
};
