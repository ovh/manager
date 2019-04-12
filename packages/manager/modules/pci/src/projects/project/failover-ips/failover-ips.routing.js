import controller from './failover-ips.controller';
import template from './failover-ips.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.failover-ips', {
      url: '/failover-ips',
      controller,
      controllerAs: '$ctrl',
      template,
      translations: {
        format: 'json',
        value: ['.'],
      },
    });
};
