export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.workflow.delete', {
    url: '/delete?workflowId',
    views: {
      modal: {
        component: 'pciProjectWorkflowDeleteComponent',
      },
    },
    layout: 'modal',
    params: {
      workflow: null,
    },
    redirectTo: (transition) => {
      const { workflow, projectId } = transition.params();
      if (!workflow || !workflow.instanceId) {
        return {
          state: 'pci.projects.project.workflow',
          params: {
            projectId,
          },
        };
      }
      return null;
    },
    resolve: {
      workflowId: /* @ngInject */ ($stateParams) => $stateParams.workflowId,
      workflow: /* @ngInject */ ($stateParams) => $stateParams.workflow,

      instance: /* @ngInject */ (
        OvhApiCloudProjectInstance,
        projectId,
        workflow,
      ) =>
        OvhApiCloudProjectInstance.v6().get({
          serviceName: projectId,
          instanceId: workflow.instanceId,
        }).$promise,

      breadcrumb: () => null,
    },
  });
};
