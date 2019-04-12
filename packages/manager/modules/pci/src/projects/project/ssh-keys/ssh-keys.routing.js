import controller from './ssh-keys.controller';
import template from './ssh-keys.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.sshKeys', {
      url: '/ssh',
      controller,
      controllerAs: '$ctrl',
      template,
      translations: {
        format: 'json',
        value: ['.'],
      },
    });
};
