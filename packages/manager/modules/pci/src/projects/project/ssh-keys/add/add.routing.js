import controller from './add.controller';
import template from './add.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.sshKeys.add', {
    url: '/add',
    views: {
      modal: {
        controller,
        controllerAs: '$ctrl',
        template,
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
