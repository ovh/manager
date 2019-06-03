import controller from './add.controller';
import template from './add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers.add', {
    url: '/add',
    layout: 'modal',
    views: {
      modal: {
        controller,
        controllerAs: '$ctrl',
        template,
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
