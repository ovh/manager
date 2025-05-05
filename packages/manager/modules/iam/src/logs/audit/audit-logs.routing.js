import { IAM_LOGS_TRACKING_HITS } from '../logs.constants';
import { name } from '../../components/logs/live-tail/live-tail.component';
import { URL } from './audit-logs.service';

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
      trackingHits: () => IAM_LOGS_TRACKING_HITS.AUDIT,
      url: () => URL,
      apiVersion: /* @ngInject */ (API_VERSION) => API_VERSION.v1,
      kind: /* @ngInject */ (logKinds, $state) =>
        $state.params.kind || logKinds[0],
      description: /* @ngInject */ ($translate, kind) =>
        $translate.instant(`iam_audit_logs_description_${kind}`),
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('iam.logs.audit.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      logKinds: /* @ngInject */ (auditLogsService) =>
        auditLogsService.getLogKinds(),
    },
  });
};
