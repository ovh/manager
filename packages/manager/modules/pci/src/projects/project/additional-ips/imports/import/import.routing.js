import controller from './import.controller';
import template from './import.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.imports.import', {
    url: '/:serviceName',
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
