import controller from './ssh-keys.controller';
import template from './ssh-keys.html';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.sshKeys', {
    url: '/ssh',
    controller,
    controllerAs: '$ctrl',
    template,
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.SETTINGS.SSH_KEYS);
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_sshKeys_title'),
    },
  });
};
