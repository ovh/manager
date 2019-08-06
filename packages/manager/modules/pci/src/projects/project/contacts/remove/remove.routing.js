export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts.remove', {
    url: '/remove?contactId',
    layout: 'modal',
    views: {
      modal: {
        component: 'pciProjectContactRemoveComponent',
      },
    },
    resolve: {
      contactId: $transition$ => $transition$.params().contactId,
      breadcrumb: () => null,
    },
  });
};
