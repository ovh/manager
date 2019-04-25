export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.new', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      goBack: ($state, projectId) => () => $state.go('pci.projects.project.instances', { projectId }),
    },
  });
};
