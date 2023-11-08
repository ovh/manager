import controllerDiff from './dns-zone-diff-tool-viewer/history.controller';
import templateDiff from './dns-zone-diff-tool-viewer/history.html';
import controllerDashboard from './dashboard/dashboard.controller';
import templateDashboard from './dashboard/dashboard.html';

const commonResolves = {
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.zone-history.diff-tool-viewer', {
    url: '/diff-tool-viewer',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: controllerDiff,
        controllerAs: '$ctrl',
        template: templateDiff,
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
  $stateProvider.state('app.zone.details.zone-history', {
    url: '/zone-history',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: controllerDashboard,
        controllerAs: '$ctrl',
        template: templateDashboard,
      },
    },
    resolve: {
      ...commonResolves,
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
