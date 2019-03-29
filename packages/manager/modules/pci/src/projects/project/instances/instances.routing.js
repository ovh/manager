export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances', {
    url: '/instances',
    component: 'pciProjectInstances',
  });
};
