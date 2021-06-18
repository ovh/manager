import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import map from 'lodash/map';

import Workflow from './Workflow.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.workflow', {
    url: '/workflow?id',
    component: 'ovhManagerPciProjectsProjectWorkflow',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('workflows')
        .then((workflow) =>
          workflow.length === 0
            ? { state: 'pci.projects.project.workflow.onboarding' }
            : false,
        ),
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      add: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.workflow.new', { projectId }),

      goToHomePage: /* @ngInject */ ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'pci.projects.project.workflow',
          {
            projectId,
          },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, 'pci.projects.project.workflow'),
          );
        }
        return promise;
      },
      workflowId: /* @ngInject */ ($transition$) => $transition$.params().id,
      workflows: /* @ngInject */ (
        $q,
        iceberg,
        OvhApiCloudProjectRegionWorkflowBackup,
        projectId,
      ) =>
        iceberg('/cloud/project/:serviceName/region')
          .query()
          .expand('CachedObjectList-Pages')
          .execute({ serviceName: projectId })
          .$promise.then(({ data }) => {
            return data.reduce((regions, { name, services }) => {
              if (
                services.find(
                  ({ name: serviceName, status: serviceStatus }) =>
                    serviceName === 'workflow' && serviceStatus === 'UP',
                )
              ) {
                return [...regions, name];
              }
              return [...regions];
            }, []);
          })
          .then((regions) => {
            const workflows = map(regions, (region) =>
              OvhApiCloudProjectRegionWorkflowBackup.v6()
                .query({
                  serviceName: projectId,
                  regionName: region,
                })
                .$promise.then((regionWorkflows) =>
                  map(regionWorkflows, (workflow) => new Workflow(workflow)),
                )
                .catch((error) =>
                  error.status === 400 ? null : $q.reject(error),
                ),
            );
            return $q
              .all(workflows)
              .then((regionWorkflows) => compact(flatten(regionWorkflows)));
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

      goToDeleteWorkflowPage: /* @ngInject */ ($state, projectId) => (
        workflow,
      ) => {
        $state.go('pci.projects.project.workflow.delete', {
          projectId,
          workflow,
          workflowId: workflow.id,
        });
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_workflow_title'),
    },
  });
};
