import LogConstants from './logs-constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs', {
    component: 'dbaasLogs',
    url: '/dbaas/logs',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: `${LogConstants.TRACKING_PREFIX}::${hit}`,
          type: 'action',
        });
      },
      // The single place the decommission flag is read and its polarity
      // inverted. `answered` records that the request actually succeeded, so
      // the notice never asserts a date state the application does not know.
      legacyAccess: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability([
            LogConstants.FEATURE.LEGACY_ACCESS_DECOMMISSIONED,
          ])
          .then((result) => ({
            answered: true,
            // isFeatureAvailable returns the raw value, undefined for an
            // absent key: only an explicit true means decommissioned.
            isDecommissioned:
              result.isFeatureAvailable(
                LogConstants.FEATURE.LEGACY_ACCESS_DECOMMISSIONED,
              ) === true,
          }))
          // Fail closed: a failed request, an unpublished key and the loading
          // window all keep the legacy write controls available.
          .catch(() => ({ answered: false, isDecommissioned: false })),
      logs: /* @ngInject */ (OvhApiDbaas) =>
        OvhApiDbaas.Logs()
          .v6()
          .query().$promise,
      me: /* @ngInject */ ($http) =>
        $http
          .get('/me')
          .then(({ data }) => data)
          .catch(() => {}),
      orderLink: /* @ngInject */ ($state) => $state.href('dbaas-logs.order'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs'),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('logs')
        .then((results) =>
          results.length === 0 ? 'dbaas-logs.onboarding' : 'dbaas-logs.list',
        ),
  });
};
