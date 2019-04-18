export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances', {
    url: '/instances',
    component: 'pciProjectInstances',
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_instances'),
    },
  });
};
