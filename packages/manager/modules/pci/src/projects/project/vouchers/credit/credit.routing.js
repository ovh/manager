import controller from './credit.controller';
import template from './credit.html';

import controllerAgora from './credit-agora.controller';
import templateAgora from './credit-agora.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.vouchers.credit', {
    url: '/credit',
    layout: 'modal',
    views: {
      modal: {
        controllerProvider: /* @ngInject */ (coreConfig) =>
          coreConfig.isRegion('US') ? controllerAgora : controller,
        controllerAs: '$ctrl',
        templateProvider: /* @ngInject */ (coreConfig) =>
          coreConfig.isRegion('US') ? templateAgora : template,
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
