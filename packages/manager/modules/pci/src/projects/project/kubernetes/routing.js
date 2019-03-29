export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes', {
      url: '/kube',
      component: 'ovhManagerKubernetesList',
      redirectTo: 'pci.projects.project.kubernetes.list',
      resolve: {
        projectId: /* @ngInject */ $transition$ => $transition$.params().projectId,
      },
    })
    .state('pci.projects.project.kubernetes.list', {
      views: {
        kubernetesListView: 'ovhManagerKubernetesListComponent',
      },
    });
};
