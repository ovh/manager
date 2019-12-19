export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.workflow.onboarding', {
      url: '/onboarding',
      component: 'pciProjectWorkflowOnboarding',
      redirectTo: (transition) => transition
        .injector()
        .getAsync('workflows')
        .then((workflow) => (workflow.length > 0 ? { state: 'pci.projects.project.workflow' } : false)),
      resolve: {
        instances: /* @ngInject */ (
          OvhApiCloudProjectInstance,
          projectId,
        ) => OvhApiCloudProjectInstance.v6().query({
          serviceName: projectId,
        }).$promise,
        goToNewInstancePage: /* @ngInject */ ($state, projectId) => () => {
          $state.go('pci.projects.project.instances.add', {
            projectId,
          });
        },
        breadcrumb: () => null, // Hide breadcrumb
      },
    });
};
