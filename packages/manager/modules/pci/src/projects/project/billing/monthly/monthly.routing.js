export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.billing.monthly', {
      url: '/monthly?instanceId',
      views: {
        modal: {
          component: 'pciInstancesInstanceActiveMonthlyBilling',
        },
      },
      layout: 'modal',
      resolve: {
        instanceId: /* @ngInject */($transition$) => $transition$.params().instanceId,
        instance: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          projectId,
          instanceId,
        ) => PciProjectsProjectInstanceService
          .get(projectId, instanceId),
        goBack: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.billing', {
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.billing'));
          }

          return promise;
        },
      },
    });
};
