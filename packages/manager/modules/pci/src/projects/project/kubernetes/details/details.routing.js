import Kubernetes from '../Kubernetes.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details', {
    url: '/:kubeId',
    component: 'ovhManagerPciProjectKubernetesDetailComponent',
    resolve: {
      breadcrumb: /* @ngInject */ (cluster) => cluster.name,
      cluster: /* @ngInject */ (kubeId, OvhApiCloudProjectKube, projectId) =>
        OvhApiCloudProjectKube.v6()
          .get({
            serviceName: projectId,
            kubeId,
          })
          .$promise.then((cluster) => new Kubernetes(cluster)),
      containersLink: /* @ngInject */ ($state, kubeId, projectId) =>
        $state.href('pci.projects.project.kubernetes.details.containers', {
          kubeId,
          projectId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToKubernetesDetails: ($state, CucCloudMessage, kubeId, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'pci.projects.project.kubernetes.details',
          {
            kubeId,
            projectId,
          },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.kubernetes.details.service',
            ),
          );
        }
        return promise;
      },
      kubeId: /* @ngInject */ ($stateParams) => $stateParams.kubeId,
      nodePoolsLink: /* @ngInject */ ($state, kubeId, projectId) =>
        $state.href('pci.projects.project.kubernetes.details.nodepools', {
          kubeId,
          projectId,
        }),
      serviceLink: /* @ngInject */ ($state, kubeId, projectId) =>
        $state.href('pci.projects.project.kubernetes.details.service', {
          kubeId,
          projectId,
        }),
    },

    redirectTo: 'pci.projects.project.kubernetes.details.service',
  });
};
