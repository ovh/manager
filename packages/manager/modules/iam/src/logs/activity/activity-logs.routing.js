import { IAM_LOGS_TRACKING_HITS } from '../logs.constants';
import { name } from '../../components/logs/live-tail/live-tail.component';
import { URL } from './activity-logs.service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs.activity', {
    url: '/activity',
    views: { logsView: name },
    atInternet: {
      rename: IAM_LOGS_TRACKING_HITS.ACTIVITY.LOGS_PAGE,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('activityLogsAvailability')
        .then(
          (activityLogAvailability) =>
            !activityLogAvailability && {
              state: 'iam.logs',
            },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_activity_logs_label'),
      trackingHits: () => IAM_LOGS_TRACKING_HITS.ACTIVITY,
      url: () => URL,
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $state) =>
        $state.params.kind || logKinds[0],
      description: /* @ngInject */ ($translate, kind) =>
        $translate.instant(`iam_activity_logs_description_${kind}`),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('iam.logs.activity.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (activityLogsService) =>
        activityLogsService.getLogKinds(),
    },
  });
};
