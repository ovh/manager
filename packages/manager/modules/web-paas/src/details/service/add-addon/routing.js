import find from 'lodash/find';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.add-addon', {
    url: '/:projectId/:addonType',
    views: {
      modal: {
        component: 'webPaasProjectAddStorage',
      },
    },
    params: {
      projectId: null,
      addonType: null,
    },
    layout: 'modal',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
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
      getOrdersURL: /* @ngInject */ () => (orderId) =>
        buildURL('dedicated', '#/billing/orders', {
          status: 'all',
          orderId,
        }),
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      breadcrumb: () => null,
    },
  });
};
