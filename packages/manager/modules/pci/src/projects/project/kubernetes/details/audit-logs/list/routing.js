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
    resolve: {
      breadcrumb: () => null,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind) => () =>
        $state.go(
          'pci.projects.project.kubernetes.details.logs',
          { kind },
          { reload: true },
        ),
    },
  });
};
