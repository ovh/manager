const commonResolves = {
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.diff-zone-tool-viewer', {
    url: '/:productId/diff-zone-tool-viewer',
    component: 'domainZoneDiffToolViewerHistory',
    resolve: {
      ...commonResolves,
      goBack: /* @ngInject */ ($state, $stateParams) => () =>
        $state.go('app.domain.zone-history', $stateParams),
    },
    params: {
      selectedDates: null,
      productId: null,
    },
  });
  $stateProvider.state('app.domain.zone-history', {
    component: 'domainZoneDashboardHistory',
    url: '/:productId/zone-history',
    resolve: {
      ...commonResolves,
      goBack: /* @ngInject */ ($state, $stateParams) => () =>
        $state.go('app.zone.details.dashboard', $stateParams),
      goToDiffViewer: /* @ngInject */ ($state) => (
        dnsEntriesForComparison,
        zoneName,
      ) =>
        $state.go('app.domain.diff-zone-tool-viewer', {
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
