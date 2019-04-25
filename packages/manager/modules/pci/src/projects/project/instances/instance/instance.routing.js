export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance', {
    url: '/:instanceId',
    component: 'pciProjectsProjectInstancesInstance',
    atInternet: { ignore: true },
    resolve: {
      instanceId: /* @ngInject */$transition$ => $transition$.params().instanceId,
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService
        .get(projectId, instanceId),

      instancePrice: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instance,
      ) => PciProjectsProjectInstanceService
        .getInstancePrice(projectId, instance),

      privateNetworks: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPrivateNetworks(projectId),
      breadcrumb: /* @ngInject */ instance => instance.name,

      instanceLink: /* @ngInject */ ($state, instance, projectId) => $state.href('pci.projects.project.instances.instance', {
        projectId,
        instanceId: instance.id,
      }),
      consoleLink: /* @ngInject */ ($state, instance, projectId) => $state.href('pci.projects.project.instances.instance.vnc', {
        projectId,
        instanceId: instance.id,
      }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () => $state
        .href($transition$.$to().name, $transition$.params()),
      editInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('', {
        projectId,
        instanceId: instance.id,
      }),
      enableMonthlyBillingInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.active-monthly-billing', {
        projectId,
        instanceId: instance.id,
      }),
      createBackupInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.backup', {
        projectId,
        instanceId: instance.id,
      }),
      startRescueInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.rescue', {
        projectId,
        instanceId: instance.id,
      }),
      endRescueInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.unrescue', {
        projectId,
        instanceId: instance.id,
      }),
      softRebootInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.soft-reboot', {
        projectId,
        instanceId: instance.id,
      }),
      hardRebootInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.hard-reboot', {
        projectId,
        instanceId: instance.id,
      }),
      reinstallInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.reinstall', {
        projectId,
        instanceId: instance.id,
      }),
      resumeInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.resume', {
        projectId,
        instanceId: instance.id,
      }),
      deleteInstance: /* @ngInject */ ($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.delete', {
        projectId,
        instanceId: instance.id,
      }),

      goToBlockStorages: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
        projectId,
      }),
      attachVolume: /* @ngInject */($state, instance, projectId) => () => $state.go('pci.projects.project.instances.instance.attachVolume', {
        projectId,
        instanceId: instance.id,
      }),
      gotToNetworks: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork', {
        projectId,
      }),
      attachNetwork: () => {

      },
    },
  });
};
