import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

import { PCI_FEATURES } from '../../projects.constant';
import { BAREMETAL_PATTERN } from './baremetal.constants';
import Instance from '../../../components/project/instance/instance.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal', {
    url: '/baremetal?help&id',
    component: 'pciProjectsProjectInstances',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.BAREMETAL);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('instances')
        .then((instances) =>
          instances.length === 0
            ? { state: 'pci.projects.project.baremetal.onboarding' }
            : false,
        ),
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_baremetal_title'),
      betaWarning: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_baremetal_beta_warning'),
      disablePrivateNetworks: () => true,
      help: /* @ngInject */ ($transition$) => $transition$.params().help,
      instanceId: /* @ngInject */ ($transition$) => $transition$.params().id,
      instances: /* @ngInject */ (
        $q,
        PciProjectsProjectInstanceService,
        projectId,
      ) =>
        PciProjectsProjectInstanceService.getAll(projectId)
          .then((instances) =>
            $q.all(
              map(instances, (instance) =>
                PciProjectsProjectInstanceService.getInstanceFlavor(
                  projectId,
                  instance,
                ).then(
                  (flavor) =>
                    new Instance({
                      ...instance,
                      flavor,
                    }),
                ),
              ),
            ),
          )
          .then((instances) =>
            filter(instances, (instance) =>
              BAREMETAL_PATTERN.test(get(instance, 'flavor.type')),
            ),
          ),
      addInstance: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.baremetal.add', {
          projectId,
        }),
      viewInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.instance', {
          projectId,
          instanceId: instance.id,
        }),
      editInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.instance.edit', {
          projectId,
          instanceId: instance.id,
        }),
      enableMonthlyBillingInstance: /* @ngInject */ ($state, projectId) => (
        instance,
      ) =>
        $state.go('pci.projects.project.baremetal.active-monthly-billing', {
          projectId,
          instanceId: instance.id,
        }),
      createBackupInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.backup', {
          projectId,
          instanceId: instance.id,
        }),
      startRescueInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.rescue', {
          projectId,
          instanceId: instance.id,
        }),
      endRescueInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.unrescue', {
          projectId,
          instanceId: instance.id,
        }),
      softRebootInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.soft-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      hardRebootInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.hard-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      reinstallInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.reinstall', {
          projectId,
          instanceId: instance.id,
        }),
      resumeInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.resume', {
          projectId,
          instanceId: instance.id,
        }),
      deleteInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.baremetal.delete', {
          projectId,
          instanceId: instance.id,
        }),
      instanceLink: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.href('pci.projects.project.baremetal.instance', {
          projectId,
          instanceId: instance.id,
        }),
      vrackLink: /* @ngInject */ ($state, projectId) => () =>
        $state.href('pci.projects.project.privateNetwork.vrack.new', {
          projectId,
        }),
      scheduleAutoBackup: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.workflow.new', {
          projectId,
          selectedInstance: instance,
        }),
      vrack: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getVrack(projectId),
      goToInstances: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.baremetal',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, 'pci.projects.project.instances'),
          );
        }

        return promise;
      },
    },
  });
};
