import controller from './imports.controller';
import template from './imports.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.failover-ips.imports', {
      url: '/imports',
      controller,
      controllerAs: '$ctrl',
      template,
      translations: {
        format: 'json',
        value: ['.'],
      },
    });
};
