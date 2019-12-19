import concat from 'lodash/concat';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import set from 'lodash/set';

import { WORKFLOW_TYPE_ENUM } from './workflow.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.workflow', {
      url: '/workflow',
      component: 'ovhManagerPciProjectsProjectWorkflow',
      redirectTo: (transition) => transition
        .injector()
        .getAsync('workflows')
        .then((workflow) => (workflow.length === 0 ? { state: 'pci.projects.project.workflow.onboarding' } : false)),
      resolve: {
        add: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.workflow.new', { projectId }),

        goToHomePage: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';
          const promise = $state.go('pci.projects.project.workflow', {
            projectId,
          },
          {
            reload,
          });
          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.workflow'));
          }
          return promise;
        },

        workflows: /* @ngInject */ (
          $q,
          OvhApiCloudProjectRegion,
          OvhApiCloudProjectRegionWorkflowBackup,
          projectId,
        ) => OvhApiCloudProjectRegion.v6().query({
          serviceName: projectId,
        }).$promise
          .then((regions) => {
            let workflows = [];
            return $q.all(
              map(regions, (region) => OvhApiCloudProjectRegionWorkflowBackup.v6().query({
                serviceName: projectId,
                regionName: region,
              }).$promise
                .then((regionWorkflows) => {
                  forEach(regionWorkflows, (workflow) => {
                    set(workflow, 'type', WORKFLOW_TYPE_ENUM.INSTANCE_BACKUP);
                    return workflow;
                  });
                  workflows = concat(workflows, regionWorkflows);
                  return regionWorkflows;
                })
                .catch(() => null)),
            ).then(() => workflows);
          }),

        goToInstancePage: /* @ngInject */ ($state, projectId) => (instanceId) => {
          $state.go('pci.projects.project.instances.instance', {
            instanceId,
            projectId,
          });
        },

        goToExecutionsPage: /* @ngInject */ ($state, projectId) => (workflow) => {
          $state.go('pci.projects.project.workflow.executions', {
            projectId,
            workflow,
            workflowId: workflow.id,
          });
        },

        goToDeleteWorkflowPage: /* @ngInject */ ($state, projectId) => (workflow) => {
          $state.go('pci.projects.project.workflow.delete', {
            projectId,
            workflow,
            workflowId: workflow.id,
          });
        },

        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_workflow_title'),
      },
    });
};
