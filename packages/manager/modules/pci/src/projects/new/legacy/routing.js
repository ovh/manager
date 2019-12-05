import get from 'lodash/get';

import component from './component';

import { PCI_URLS } from '../../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new', {
    url: '/new',
    views: {
      '@pci': component.name,
    },
    resolve: {
      breadcrumb: () => null,

      cancelHref: /* @ngInject */ ($state) => $state.href('pci.projects'),

      getExpressOrderLink: /* @ngInject */ (model) => () =>
        get(PCI_URLS, 'US.website_order["cloud-resell-eu"].US')(
          model.description || '',
        ),

      model: () => ({
        description: null,
      }),
    },
  });
};
