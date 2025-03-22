import { IAM_LOGS_TRACKING_HITS } from '../logs.constants';
import { name } from '../../components/logs/live-tail/live-tail.component';
import { URL } from './access-policy-logs.service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs.access-policy', {
    url: '/access-policy',
    views: { logsView: name },
    atInternet: {
      rename: IAM_LOGS_TRACKING_HITS.ACCESS_POLICY.LOGS_PAGE,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('accessPolicyLogsAvailability')
        .then(
          (accessPolicyLogsAvailability) =>
            !accessPolicyLogsAvailability && {
              state: 'iam',
            },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_access_policy_logs_label'),
      trackingHits: () => IAM_LOGS_TRACKING_HITS.ACCESS_POLICY,
      url: () => URL,
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v2,
      kind: /* @ngInject */ (logKinds, $state) =>
        $state.params.kind || logKinds[0],
      description: /* @ngInject */ ($translate, kind) =>
        $translate.instant(`iam_access_policy_logs_description_${kind}`),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('iam.logs.access-policy.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (accessPolicyLogsService) =>
        accessPolicyLogsService.getLogKinds(),
    },
  });
};
