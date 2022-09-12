import find from 'lodash/find';
import set from 'lodash/set';
import { buildURL } from '@ovh-ux/ufrontend';
import Addon from '../../addon.class';
import { ADDON_FAMILY, ADDON_TYPE } from '../../web-paas.constants';

export const commonResolves = {
  addonType: /* @ngInject */ ($transition$) => $transition$.params().addonType,
  addon: /* @ngInject */ (WebPaas, project, addonType) => {
    return WebPaas.getAdditionalOption(project.serviceId, project).then(
      (result) => {
        const addon = find(result, { productName: addonType });
        const projectAddon = find(project.addons, { productName: addonType });
        if (addonType === ADDON_TYPE.STORAGE) {
          // Storage is additional option of environnment. Adding environment service name to create new storage addon
          return new Addon({
            ...find(result, { family: ADDON_FAMILY.STORAGE }),
            ...projectAddon,
            presentQuantity: projectAddon?.quantity,
            environmentServiceName: projectAddon
              ? undefined
              : project.getEnvironmentServiceName(),
          });
        }
        set(addon, 'presentQuantity', projectAddon?.quantity);
        Object.assign(addon, projectAddon);
        return addon;
      },
    );
  },
  addOnServiceId: (WebPaas, serviceInfo, addonType) => {
    if (addonType === ADDON_TYPE.STORAGE) {
      return WebPaas.getAddOnServiceId(
        serviceInfo.serviceId,
        ADDON_TYPE.ENVIRONMENT,
      ).then((stagingServiceId) =>
        WebPaas.getAddOnServiceId(stagingServiceId, ADDON_TYPE.STORAGE).then(
          (serviceId) => serviceId,
        ),
      );
    }
    return WebPaas.getAddOnServiceId(serviceInfo.serviceId, addonType);
  },
  getOrderUrl: /* @ngInject */ () => (orderId) =>
    buildURL('dedicated', '#/billing/orders', {
      status: 'all',
      orderId,
    }),
  breadcrumb: () => null,
};

export default {
  commonResolves,
};
