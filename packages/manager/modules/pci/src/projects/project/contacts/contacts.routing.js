import controller from './contacts.controller';
import template from './contacts.html';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts', {
    url: '/contacts',
    template,
    controller,
    controllerAs: '$ctrl',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.SETTINGS.CONTACTS);
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_contacts_title'),
    },
  });
};
