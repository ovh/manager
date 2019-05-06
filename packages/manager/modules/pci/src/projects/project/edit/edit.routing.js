import controller from './edit.controller';
import template from './edit.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.edit', {
      url: '/edit',
      views: {
        contentTab: {
          controller,
          controllerAs: '$ctrl',
          template,
        },
      },
      translations: {
        format: 'json',
        value: ['.'],
      },
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_parameters')),
      },
    });
};
