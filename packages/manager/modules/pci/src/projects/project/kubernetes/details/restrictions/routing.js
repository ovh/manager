export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.restrictions', {
    url: '/restrictions',
    views: {
      kubernetesView: 'pciProjectKubernetesRestrictions',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kube_restrictions'),
      restrictions: /* @ngInject */ (loadRestrictions) => loadRestrictions(),
      updateRestrictions: /* @ngInject */ ($http, kubeId, projectId) => (ips) =>
        $http
          .put(`/cloud/project/${projectId}/kube/${kubeId}/ipRestrictions`, {
            ips,
          })
          .then(({ data }) => data),
      deleteRestriction: /* @ngInject */ ($http, kubeId, projectId) => (ip) =>
        $http
          .delete(
            `/cloud/project/${projectId}/kube/${kubeId}/ipRestrictions/${encodeURIComponent(
              ip,
            )}`,
          )
          .then(({ data }) => data),
    },
  });
};
