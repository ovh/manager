import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

import Instance from '../../../../components/project/instance/instance.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.workflow.new', {
      url: '/new',
      component: 'ovhManagerPciProjectWorkflowAdd',
      params: {
        selectedInstance: null,
      },
      redirectTo: (transition) => transition
        .injector()
        .getAsync('instances')
        .then((instances) => (instances.length === 0 ? { state: 'pci.projects.project.instances' } : false)),
      resolve: {
        selectedInstance: /* @ngInject */ ($transition$) => $transition$.params().selectedInstance,
        instances: /* @ngInject */ (
          projectId,
          OvhApiCloudProjectInstance,
        ) => OvhApiCloudProjectInstance.v6().query({
          serviceName: projectId,
        }).$promise
          .then((instances) => map(instances, (instance) => new Instance(instance))),
        regions: /* @ngInject */ (
          $q,
          projectId,
          OvhApiCloudProjectRegion,
        ) => OvhApiCloudProjectRegion.v6().query({
          serviceName: projectId,
        }).$promise
          .then((regionIds) => $q.all(regionIds
            .map((id) => OvhApiCloudProjectRegion
              .v6().get({ serviceName: projectId, id }).$promise))),
        isWorkflowSupportedOnRegion: /* @ngInject */ (regions) => (regionName) => {
          const region = find(regions, (regionObj) => regionObj.name === regionName);
          return !isEmpty(find(region.services, { name: 'workflow', status: 'UP' }));
        },
        initialStep: /* @ngInject */ (
          selectedInstance,
          isWorkflowSupportedOnRegion,
        ) => {
          if (selectedInstance) {
            if (isWorkflowSupportedOnRegion(selectedInstance.region)) {
              return 2;
            }
            return 1;
          }
          return 0;
        },
        cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.workflow', {
          projectId,
        }),

        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_workflow_add'),
      },
    });
};
