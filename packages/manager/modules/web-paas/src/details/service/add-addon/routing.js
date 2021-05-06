import find from 'lodash/find';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.add-addon', {
    url: '/:addonType',
    views: {
      modal: {
        component: 'webPaasProjectAddStorage',
      },
    },
    params: {
      addonType: null,
    },
    layout: 'modal',
    resolve: {
      addonType: /* @ngInject */ ($transition$) =>
        $transition$.params().addonType,
      addon: /* @ngInject */ (WebPaas, project, addonType) => {
        return WebPaas.getAdditionalOption(project.serviceId).then((result) => {
          const addon = find(result, { productName: addonType });
          Object.assign(
            addon,
            find(project.addons, { productName: addon.productName }),
          );
          return addon;
        });
      },
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      getOrderUrl: /* @ngInject */ () => (orderId) =>
        buildURL('dedicated', '#/billing/orders', {
          status: 'all',
          orderId,
        }),
      breadcrumb: () => null,
    },
  });
};
