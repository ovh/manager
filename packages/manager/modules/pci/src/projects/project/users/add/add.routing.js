export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.users.add', {
      url: '/new',
      views: {
        modal: {
          component: 'pciProjectUsersAdd',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        goBack: /* @ngInject */ goToUsers => goToUsers,
      },
    });
};
