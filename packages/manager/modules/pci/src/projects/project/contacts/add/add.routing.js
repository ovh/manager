export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts.add', {
    url: '/add',
    layout: 'modal',
    views: {
      modal: {
        component: 'pciProjectContactAddComponent',
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
