export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.users.onboarding.add', {
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
