import { IAM_LOGS_TRACKING_HITS } from '../logs.constants';
import { name } from './audit-logs.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.logs.audit', {
    url: '/audit',
    views: { logsView: name },
    atInternet: {
      rename: IAM_LOGS_TRACKING_HITS.AUDIT.LOGS_PAGE,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('auditLogsAvailability')
        .then(
          (auditLogAvailability) =>
            !auditLogAvailability && {
              state: 'iam',
            },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_audit_logs_label'),
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v2,
      kind: /* @ngInject */ (logKinds, $state) =>
        $state.params.kind || logKinds[0],
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('iam.logs.audit.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
    },
  });
};
