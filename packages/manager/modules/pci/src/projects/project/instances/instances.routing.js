export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances', {
    url: '/instances',
    component: 'pciProjectsProjectInstances',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_instances_title'),
      addInstance: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.instances.add', {
        projectId,
      }),
      viewInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.instance', {
        projectId,
        instanceId: instance.id,
      }),
      editInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('', {
        projectId,
        instanceId: instance.id,
      }),
      enableMonthlyBillingInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.active-monthly-billing', {
        projectId,
        instanceId: instance.id,
      }),
      createBackupInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.backup', {
        projectId,
        instanceId: instance.id,
      }),
      startRescueInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.rescue', {
        projectId,
        instanceId: instance.id,
      }),
      endRescueInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.unrescue', {
        projectId,
        instanceId: instance.id,
      }),
      softRebootInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.soft-reboot', {
        projectId,
        instanceId: instance.id,
      }),
      hardRebootInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.hard-reboot', {
        projectId,
        instanceId: instance.id,
      }),
      reinstallInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.reinstall', {
        projectId,
        instanceId: instance.id,
      }),
      resumeInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.resume', {
        projectId,
        instanceId: instance.id,
      }),
      deleteInstance: /* @ngInject */ ($state, projectId) => instance => $state.go('pci.projects.project.instances.delete', {
        projectId,
        instanceId: instance.id,
      }),
      instanceLink: /* @ngInject */ ($state, projectId) => instance => $state.href('pci.projects.project.instances.instance', {
        projectId,
        instanceId: instance.id,
      }),
    },
  });
};
