export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes', {
      url: '/kubernetes',
      component: 'ovhManagerPciProjectKubernetes',
      resolve: {
        addCluster: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.kubernetes.add', { projectId }),
        goToKubernetes: ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.kubernetes', {
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'kubernetes'));
          }

          return promise;
        },

        breadcrumb: /* @ngInject */ $translate => $translate.instant('kube_list_title'),
      },
    });
};
