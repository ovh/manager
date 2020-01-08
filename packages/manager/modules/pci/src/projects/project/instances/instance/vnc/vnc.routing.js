export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.vnc', {
    url: '/vnc',
    component: 'pciInstancesInstanceVNC',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_instance_vnc_title'),
      vncInfos: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        instance,
        projectId,
      ) => PciProjectsProjectInstanceService.getVNCInfos(projectId, instance),
    },
  });
};
