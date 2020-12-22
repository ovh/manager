import get from 'lodash/get';
import head from 'lodash/head';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance', {
    url: '/:instanceId',
    component: 'pciProjectsProjectInstancesInstance',
    resolve: {
      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService.get(projectId, instanceId),

      instancePrice: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instance,
      ) =>
        PciProjectsProjectInstanceService.getInstancePrice(projectId, instance),

      reverseDnsLink: () => buildURL('dedicated', '#/configuration/ip'),

      ipMitigationLink: /* @ngInject */ (instance) => {
        const ip = get(head(instance.publicIpV4), 'ip');
        return buildURL('dedicated', '#/configuration/ip', {
          action: 'mitigation',
          ip,
          ipBlock: ip,
        });
      },

      firewallLink: /* @ngInject */ (instance) => {
        const ip = get(head(instance.publicIpV4), 'ip');
        return buildURL('dedicated', '#/configuration/ip', {
          action: 'toggleFirewall',
          ip,
          ipBlock: ip,
        });
      },

      breadcrumb: /* @ngInject */ (instance) => instance.name,

      instanceLink: /* @ngInject */ ($state, instance, projectId) =>
        $state.href('pci.projects.project.instances.instance', {
          projectId,
          instanceId: instance.id,
        }),
      consoleLink: /* @ngInject */ ($state, instance, projectId) =>
        $state.href('pci.projects.project.instances.instance.vnc', {
          projectId,
          instanceId: instance.id,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      editInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.edit', {
          projectId,
          instanceId: instance.id,
        }),
      enableMonthlyBillingInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.instances.instance.active-monthly-billing',
          {
            projectId,
            instanceId: instance.id,
          },
        ),
      createBackupInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go('pci.projects.project.instances.instance.backup', {
          projectId,
          instanceId: instance.id,
        }),
      startRescueInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go('pci.projects.project.instances.instance.rescue', {
          projectId,
          instanceId: instance.id,
        }),
      endRescueInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.unrescue', {
          projectId,
          instanceId: instance.id,
        }),
      softRebootInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.soft-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      hardRebootInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.hard-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      reinstallInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.reinstall', {
          projectId,
          instanceId: instance.id,
        }),
      resumeInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.resume', {
          projectId,
          instanceId: instance.id,
        }),
      deleteInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.delete', {
          projectId,
          instanceId: instance.id,
        }),
      applicationAccess: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go(
          'pci.projects.project.instances.instance.application-access',
          {
            projectId,
            instanceId: instance.id,
          },
        ),
      goToBlockStorages: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.blocks', {
          projectId,
        }),
      attachVolume: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.instances.instance.attachVolume', {
          projectId,
          instanceId: instance.id,
        }),
      gotToNetworks: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.privateNetwork', {
          projectId,
        }),
      attachPrivateNetwork: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.instances.instance.attachPrivateNetwork',
          {
            projectId,
            instanceId: instance.id,
          },
        ),
      goToInstance: /* @ngInject */ (
        $rootScope,
        CucCloudMessage,
        $state,
        instanceId,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.instances.instance',
          {
            projectId,
            instanceId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.instances.instance',
            ),
          );
        }

        return promise;
      },
    },
  });
};
