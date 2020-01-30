import controller from './contacts.controller';
import template from './contacts.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts', {
    url: '/contacts',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_contacts_title'),
    },
  });
};
