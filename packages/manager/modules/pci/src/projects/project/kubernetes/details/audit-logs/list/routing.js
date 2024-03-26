import { LOG_LIST_TRACKING_HITS } from '../audit-logs.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.logs.list', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      'kubernetesView@pci.projects.project.kubernetes.details':
        'pciProjectKubernetesDetailsAuditLogsList',
    },
    atInternet: {
      rename: LOG_LIST_TRACKING_HITS.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind, trackClick) => () => {
        trackClick(LOG_LIST_TRACKING_HITS.GO_BACK);
        $state.go(
          'pci.projects.project.kubernetes.details.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};
