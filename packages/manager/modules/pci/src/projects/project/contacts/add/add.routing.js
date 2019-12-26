import controller from './add.controller';
import template from './add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts.add', {
    url: '/add',
    layout: 'modal',
    views: {
      modal: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
