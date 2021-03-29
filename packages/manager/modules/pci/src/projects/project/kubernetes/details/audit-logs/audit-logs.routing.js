export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.logs', {
    url: '/logs',
    views: {
      kubernetesView: 'pciProjectKubernetesDetailsAuditLogs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kube_logs_tab_title'),
    },
  });
};
