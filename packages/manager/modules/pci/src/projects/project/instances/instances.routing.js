import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

import {
  POLLER_INSTANCE_NAMESPACE,
  TYPES_TO_EXCLUDE,
} from './instances.constants';
import Instance from '../../../components/project/instance/instance.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances', {
    url: '/instances?help&id',
    component: 'pciProjectsProjectInstances',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('instances')
        .then((instances) =>
          instances.length === 0
            ? { state: 'pci.projects.project.instances.onboarding' }
            : false,
        ),
    onExit: /* @ngInject */ (killTasks) => {
      killTasks({ namespace: POLLER_INSTANCE_NAMESPACE.SHELVE });
      killTasks({ namespace: POLLER_INSTANCE_NAMESPACE.UNSHELVE });
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_title'),
      help: /* @ngInject */ ($transition$) => $transition$.params().help,
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
            filter(
              instances,
              (instance) =>
                !find(TYPES_TO_EXCLUDE, (pattern) =>
                  pattern.test(get(instance, 'flavor.type')),
                ),
            ),
          ),
      instanceId: /* @ngInject */ ($transition$) => $transition$.params().id,

      instancesRegions: /* @ngInject */ (instances) =>
        Array.from(new Set(instances.map(({ region }) => region))),

      addInstance: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.instances.add', {
          projectId,
        }),
      viewInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId: instance.id,
        }),
      editInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.instance.edit', {
          projectId,
          instanceId: instance.id,
        }),
      enableMonthlyBillingInstance: /* @ngInject */ ($state, projectId) => (
        instance,
      ) =>
        $state.go('pci.projects.project.instances.active-monthly-billing', {
          projectId,
          instanceId: instance.id,
        }),
      createBackupInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.backup', {
          projectId,
          instanceId: instance.id,
        }),
      startRescueInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.rescue', {
          projectId,
          instanceId: instance.id,
        }),
      endRescueInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.unrescue', {
          projectId,
          instanceId: instance.id,
        }),
      softRebootInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.soft-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      hardRebootInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.hard-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      startInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.start', {
          projectId,
          instanceId: instance.id,
        }),
      shelveInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.shelve', {
          projectId,
          instanceId: instance.id,
        }),
      stopInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.stop', {
          projectId,
          instanceId: instance.id,
        }),
      unshelveInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.unshelve', {
          projectId,
          instanceId: instance.id,
        }),
      reinstallInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.reinstall', {
          projectId,
          instanceId: instance.id,
        }),
      resumeInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.resume', {
          projectId,
          instanceId: instance.id,
        }),
      deleteInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.delete', {
          projectId,
          instanceId: instance.id,
        }),
      instanceLink: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.href('pci.projects.project.instances.instance', {
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
          'pci.projects.project.instances',
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
      refreshInstances: /* @ngInject */ (
        $state,
        OvhApiCloudProjectInstance,
      ) => () => {
        OvhApiCloudProjectInstance.v6().resetAllCache();
        return $state.reload();
      },
      killTasks: /* @ngInject */ (Poller) => (pattern) => Poller.kill(pattern),

      /** If one/some instances is still in shelving we run a sub task until the instance is shelved
       * Also, the sub tasks are killed if changed state is different from instances.*
       */
      pollShelvingInstances: /* @ngInject */ (
        $translate,
        CucCloudMessage,
        Poller,
        instances,
        projectId,
        refreshInstances,
      ) => {
        instances.forEach((instance) => {
          if (instance.isShelving()) {
            const endPointUrl = `/cloud/project/${projectId}/instance/${instance.id}`;
            Poller.poll(endPointUrl, null, {
              interval: 5000,
              successRule(i) {
                return new Instance(i).isShelved();
              },
              namespace: POLLER_INSTANCE_NAMESPACE.SHELVE,
              notifyOnError: false,
            })
              .then(() => refreshInstances())
              .then(() =>
                CucCloudMessage.success(
                  $translate.instant(
                    'pci_projects_project_instances_instance_shelve_success_message',
                    {
                      instance: instance.name,
                    },
                  ),
                ),
              );
          }
        });
      },

      /** If one/some instances is still in unshelving we run a sub task until the instance is active
       * Also, the sub tasks are killed if changed state is different from instances.*
       */
      pollUnshelvingInstances: /* @ngInject */ (
        $translate,
        CucCloudMessage,
        Poller,
        instances,
        projectId,
        refreshInstances,
      ) => {
        instances.forEach((instance) => {
          if (instance.isUnshelving()) {
            const endPointUrl = `/cloud/project/${projectId}/instance/${instance.id}`;
            Poller.poll(endPointUrl, null, {
              interval: 5000,
              successRule(i) {
                return new Instance(i).isStarted();
              },
              namespace: POLLER_INSTANCE_NAMESPACE.UNSHELVE,
              notifyOnError: false,
            })
              .then(() => refreshInstances())
              .then(() =>
                CucCloudMessage.success(
                  $translate.instant(
                    'pci_projects_project_instances_instance_unshelve_success_message',
                    {
                      instance: instance.name,
                    },
                  ),
                ),
              );
          }
        });
      },
    },
  });
};
