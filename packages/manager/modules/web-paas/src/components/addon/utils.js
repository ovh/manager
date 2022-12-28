import find from 'lodash/find';
import set from 'lodash/set';
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
  addonServiceId: /* @ngInject */ (WebPaas, serviceInfo, addonType) => {
    if (addonType === ADDON_TYPE.STORAGE) {
      return WebPaas.getAddonServiceId(
        serviceInfo.serviceId,
        ADDON_TYPE.ENVIRONMENT,
      ).then((stagingServiceId) =>
        WebPaas.getAddonServiceId(stagingServiceId, ADDON_TYPE.STORAGE).then(
          (serviceId) => serviceId,
        ),
      );
    }
    return WebPaas.getAddonServiceId(serviceInfo.serviceId, addonType);
  },
  getOrderUrl: /* @ngInject */ (coreURLBuilder) => (orderId) =>
    coreURLBuilder.buildURL('dedicated', '#/billing/orders/:orderId', {
      orderId,
    }),
  breadcrumb: () => null,
};

export default {
  commonResolves,
};
