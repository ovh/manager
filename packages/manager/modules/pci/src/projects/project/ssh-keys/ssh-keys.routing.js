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
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_sshKeys_title')),
      },
    });
};
