export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.dashboard', {
    url: '/dashboard',
    component: 'ovhManagerPciProjectInstanceDashboardComponent',
    atInternet: { ignore: true },
    translations: ['.'],
    resolve: {
      onClickDelete: ($state, projectId, instanceId) => () => $state.go('pci.projects.project.instances.instance.delete', {
        projectId,
        instanceId,
      }),
    },
  });
};
