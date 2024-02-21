import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.sshKeys', {
    url: '/ssh',
    component: 'pciProjectSshKeys',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.SETTINGS.SSH_KEYS);
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_sshKeys_title'),

      goToAddSshkey: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.sshKeys.add'),
    },
  });
};
