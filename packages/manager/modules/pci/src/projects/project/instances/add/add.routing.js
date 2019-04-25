export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.new', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate
        .refresh()
        .then(() => $translate.instant('pci_projects_project_instances_add_title')),
      goBack: ($state, projectId) => () => $state.go('pci.projects.project.instances', { projectId }),
    },
  });
};
