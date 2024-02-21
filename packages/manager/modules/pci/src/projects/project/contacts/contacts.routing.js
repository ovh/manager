import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts', {
    url: '/contacts',
    component: 'pciProjectContacts',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.SETTINGS.CONTACTS);
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_contacts_title'),

      goToAddContact: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.contacts.add'),
    },
  });
};
