import controller from './projects.controller';
import template from './projects.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects', {
      url: '/projects',
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
          .then(() => $translate.instant('pci_projects')),
      },
    });
};
