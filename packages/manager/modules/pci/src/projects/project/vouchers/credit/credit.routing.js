import { Environment } from '@ovh-ux/manager-config';

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
        controller:
          Environment.getRegion() === 'US' ? controllerAgora : controller,
        controllerAs: '$ctrl',
        template: Environment.getRegion() === 'US' ? templateAgora : template,
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
