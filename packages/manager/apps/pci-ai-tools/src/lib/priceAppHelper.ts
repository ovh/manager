import ai from '@/types/AI';
import {
  AppGlobalPricing,
  Flavor,
  ImagePartnerApp,
  Scaling,
} from '@/types/orderFunnel';

export function createAppPriceObject(
  image: {
    name?: string;
    version?: string;
  },
  partnerAppImages: ImagePartnerApp[],
  scaling: Scaling,
  resource: Flavor,
  resourceNumber: number,
): AppGlobalPricing {
  const nbReplicas = scaling.autoScaling
    ? scaling.replicasMin
    : scaling.replicas;

  const appPricing: AppGlobalPricing = {
    resourcePricing: {
      price: 60 * resourceNumber * resource?.pricing[0]?.price,
      tax: 60 * resourceNumber * resource?.pricing[0]?.tax,
    },
  };

  if (image.version) {
    const selectedPartnerApp = partnerAppImages.find(
      (app) => app.id === image.name,
    );

    const price =
      resource.type === ai.capabilities.FlavorTypeEnum.gpu
        ? selectedPartnerApp.pricingGpu.price
        : selectedPartnerApp.pricingCpu.price;

    const tax =
      resource.type === ai.capabilities.FlavorTypeEnum.gpu
        ? selectedPartnerApp.pricingGpu.tax
        : selectedPartnerApp.pricingCpu.tax;

    switch (selectedPartnerApp?.licensing) {
      case ai.capabilities.LicensingTypeEnum['per-resource']:
        appPricing.partnerLicence = {
          price: 60 * price * resourceNumber * nbReplicas,
          tax: 60 * tax * resourceNumber * nbReplicas,
        };
        break;
      case ai.capabilities.LicensingTypeEnum['per-replica']:
        appPricing.partnerLicence = {
          price: price * nbReplicas,
          tax: tax * nbReplicas,
        };
        break;
      case ai.capabilities.LicensingTypeEnum['per-second-bracket']:
        appPricing.partnerLicence = {
          price: price * 60,
          tax: tax * 60,
        };
        break;
      default:
        appPricing.partnerLicence = {
          price,
          tax,
        };
        break;
    }
  }

  if (nbReplicas > 1) {
    appPricing.scalingPricing = {
      price: (nbReplicas - 1) * appPricing.resourcePricing.price,
      tax: (nbReplicas - 1) * appPricing.resourcePricing.tax,
    };
  }

  return appPricing;
}
