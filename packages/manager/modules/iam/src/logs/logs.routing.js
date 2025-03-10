import { FEATURE_LOGS } from './logs.constants';
import { name } from './logs.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs', {
    url: '/logs',
    atInternet: {
      ignore: true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((featureAvailability) => ({
          state: featureAvailability.isFeatureAvailable(FEATURE_LOGS.ROOT)
            ? 'iam.logs.audit'
            : 'iam',
        })),
    component: name,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_logs_label'),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability(
          Object.values(FEATURE_LOGS).join(','),
        ),
      auditLogsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.AUDIT),
      activityLogsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.ACTIVITY),
      accessPolicyLogsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.ACCESS_POLICY),
      logKinds: /* @ngInject */ (logsService) => logsService.getLogKinds(),
    },
  });
};
