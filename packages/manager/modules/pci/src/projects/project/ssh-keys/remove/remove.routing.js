import controller from './remove.controller';
import template from './remove.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.sshKeys.remove', {
    url: '/:keyId/remove',
    controller,
    controllerAs: '$ctrl',
    template,
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
