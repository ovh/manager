import get from 'lodash/get';

import component from './component';

import { GUIDE_URLS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.creating', {
    url: '/creating/:orderId/:voucherCode',
    views: {
      '@pci': component.name,
    },
    resolve: {
      breadcrumb: () => null,

      guideUrl: /* @ngInject */ (me) => get(GUIDE_URLS, me.ovhSubsidiary),

      pciProjectsHref: /* @ngInject */ ($state) => $state.href('pci.projects'),

      onProjectDelivered: /* @ngInject */ ($state, atInternet, voucherCode) => (
        projectId,
      ) => {
        atInternet.trackPage({
          name: 'public-cloud::pci::projects::created',
          projectId,
          ...(voucherCode ? { voucherCode } : {}),
        });
        return $state.go('pci.projects.project', {
          projectId,
        });
      },

      onProjectDeliveryFail: /* @ngInject */ ($state, $translate) => () =>
        $state.go(
          'pci.error',
          {
            message: $translate.instant('pci_projects_creating_delivery_error'),
          },
          {
            location: false,
          },
        ),

      orderId: /* @ngInject */ ($transition$) => $transition$.params().orderId,

      orderStatus: /* @ngInject */ (orderId, pciProjectCreating) =>
        pciProjectCreating.getOrderStatus(orderId),

      voucherCode: /* @ngInject */ ($transition$) =>
        $transition$.params().voucherCode,
    },
  });
};
