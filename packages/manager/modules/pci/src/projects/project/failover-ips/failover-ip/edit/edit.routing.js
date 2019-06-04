import controller from './edit.controller';
import template from './edit.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.failover-ips.edit', {
      url: '/:serviceName/edit',
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
