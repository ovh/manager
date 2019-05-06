export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.creating', {
      url: '/creating',
      component: 'pciProjectCreating',
      resolve: {
        breadcrumb: () => null,
        onProjectCreated: /* @ngInject */ $state => () => $state.go('^'),
      },
    });
};
