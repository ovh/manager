import get from 'lodash/get';
import head from 'lodash/head';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance', {
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
        catalogEndpoint,
      ) =>
        PciProjectsProjectInstanceService.getInstancePrice(
          projectId,
          instance,
          catalogEndpoint,
        ),

      reverseDnsLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/configuration/ip'),

      ipMitigationLink: /* @ngInject */ (instance, coreURLBuilder) => {
        const ip = get(head(instance.publicIpV4), 'ip');
        return coreURLBuilder.buildURL('dedicated', '#/configuration/ip', {
          action: 'mitigation',
          ip,
          ipBlock: ip,
        });
      },

      firewallLink: /* @ngInject */ (instance, coreURLBuilder) => {
        const ip = get(head(instance.publicIpV4), 'ip');
        return coreURLBuilder.buildURL('dedicated', '#/configuration/ip', {
          action: 'toggleFirewall',
          ip,
          ipBlock: ip,
        });
      },

      breadcrumb: /* @ngInject */ (instance) => instance.name,

      instanceLink: /* @ngInject */ ($state, instance, projectId) =>
        $state.href('pci.projects.project.baremetal.instance', {
          projectId,
          instanceId: instance.id,
        }),
      consoleLink: /* @ngInject */ ($state, instance, projectId) =>
        $state.href('pci.projects.project.baremetal.instance.vnc', {
          projectId,
          instanceId: instance.id,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      editInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.edit', {
          projectId,
          instanceId: instance.id,
        }),
      enableMonthlyBillingInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.baremetal.instance.active-monthly-billing',
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
        $state.go('pci.projects.project.baremetal.instance.backup', {
          projectId,
          instanceId: instance.id,
        }),
      startRescueInstance: /* @ngInject */ (
        $state,
        instance,
        projectId,
      ) => () =>
        $state.go('pci.projects.project.baremetal.instance.rescue', {
          projectId,
          instanceId: instance.id,
        }),
      endRescueInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.unrescue', {
          projectId,
          instanceId: instance.id,
        }),
      softRebootInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.soft-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      hardRebootInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.hard-reboot', {
          projectId,
          instanceId: instance.id,
        }),
      reinstallInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.reinstall', {
          projectId,
          instanceId: instance.id,
        }),
      resumeInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.resume', {
          projectId,
          instanceId: instance.id,
        }),
      deleteInstance: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go('pci.projects.project.baremetal.instance.delete', {
          projectId,
          instanceId: instance.id,
        }),
      applicationAccess: /* @ngInject */ ($state, instance, projectId) => () =>
        $state.go(
          'pci.projects.project.baremetal.instance.application-access',
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
        $state.go('pci.projects.project.baremetal.instance.attachVolume', {
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
          'pci.projects.project.baremetal.instance.attachPrivateNetwork',
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
          'pci.projects.project.baremetal.instance',
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
      vncDisabled: () => true, // No vnc in alpha. Remove this to enable vnc
    },
  });
};
