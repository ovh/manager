import { FEATURE_LOGS } from './logs.constants';
import { name } from './logs.component';

const redirectTo = (transition) =>
  transition
    .injector()
    .get('$q')
    .all([
      transition.injector().getAsync('logsAvailability'),
      transition.injector().getAsync('auditLogsAvailability'),
      transition.injector().getAsync('activityLogsAvailability'),
      transition.injector().getAsync('accessPolicyLogsAvailability'),
    ])
    .then(
      ([
        auditLogsAvailability,
        activityLogsAvailability,
        accessPolicyLogsAvailability,
      ]) => {
        if (accessPolicyLogsAvailability) {
          return 'iam.logs.access-policy';
        }
        if (activityLogsAvailability) {
          return 'iam.logs.activity';
        }
        if (auditLogsAvailability) {
          return 'iam.logs.audit';
        }
        return 'iam';
      },
    );

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs', {
    url: '/logs',
    atInternet: {
      ignore: true,
    },
    redirectTo,
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
      logsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.ROOT),
      auditLogsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.AUDIT),
      activityLogsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.ACTIVITY),
      accessPolicyLogsAvailability: /* @ngInject */ (features) =>
        features.isFeatureAvailable(FEATURE_LOGS.ACCESS_POLICY),
    },
  });
};
