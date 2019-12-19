import filter from 'lodash/filter';
import head from 'lodash/head';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.workflow.executions', {
      url: '/:workflowId/executions',
      component: 'ovhManagerPciProjectWorkflowExecutions',
      params: {
        workflow: null,
      },
      resolve: {
        workflowId: /* @ngInject */ ($stateParams) => $stateParams.workflowId,
        getWorkflow: /* @ngInject */ ($stateParams, workflows, workflowId) => () => {
          if ($stateParams.workflow) {
            return $stateParams.workflow;
          }
          return head(filter(workflows, ({ id }) => id === workflowId));
        },
        workflow: /* @ngInject */ (getWorkflow) => getWorkflow(),
        executions: /* @ngInject */ (workflow) => {
          if (workflow && workflow.executions) {
            return workflow.executions;
          }
          return [];
        },
        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_workflow_executions'),
      },
    });
};
