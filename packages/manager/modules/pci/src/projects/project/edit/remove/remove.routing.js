import controller from './remove.controller';
import template from './remove.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.edit.remove', {
      url: '/remove',
      views: {
        modal: {
          controller,
          controllerAs: '$ctrl',
          template,
        },
      },
      layout: 'modal',
      translations: {
        format: 'json',
        value: ['.'],
      },
      resolve: {
        breadcrumb: () => null,
      },
    });
};
