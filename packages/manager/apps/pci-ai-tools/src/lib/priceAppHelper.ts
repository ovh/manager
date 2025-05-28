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
  partnerAppImage: ImagePartnerApp[],
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
    const selectedPartnerApp = partnerAppImage.find(
      (app) => app.id === image.name,
    );

    if (
      selectedPartnerApp?.licensing ===
      ai.capabilities.LicensingTypeEnum['per-resource']
    ) {
      appPricing.partnerLicence = {
        price:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? 60 *
              selectedPartnerApp.pricingGpu.price *
              resourceNumber *
              nbReplicas
            : 60 *
              selectedPartnerApp.pricingCpu.price *
              resourceNumber *
              nbReplicas,
        tax:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? 60 *
              selectedPartnerApp.pricingGpu.tax *
              resourceNumber *
              nbReplicas
            : 60 *
              selectedPartnerApp.pricingCpu.tax *
              resourceNumber *
              nbReplicas,
      };
    } else if (
      selectedPartnerApp?.licensing ===
      ai.capabilities.LicensingTypeEnum['per-replica']
    ) {
      appPricing.partnerLicence = {
        price:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? selectedPartnerApp.pricingGpu.price * nbReplicas
            : selectedPartnerApp.pricingCpu.price * nbReplicas,
        tax:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? selectedPartnerApp.pricingGpu.tax * nbReplicas
            : selectedPartnerApp.pricingCpu.tax * nbReplicas,
      };
    } else if (
      selectedPartnerApp?.licensing ===
      ai.capabilities.LicensingTypeEnum['per-second-bracket']
    ) {
      appPricing.partnerLicence = {
        price:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? selectedPartnerApp.pricingGpu.price * 60
            : selectedPartnerApp.pricingCpu.price * 60,
        tax:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? selectedPartnerApp.pricingGpu.tax * 60
            : selectedPartnerApp.pricingCpu.tax * 60,
      };
    } else if (selectedPartnerApp) {
      appPricing.partnerLicence = {
        price:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? selectedPartnerApp.pricingGpu.price
            : selectedPartnerApp.pricingCpu.price,
        tax:
          resource.type === ai.capabilities.FlavorTypeEnum.gpu
            ? selectedPartnerApp.pricingGpu.tax
            : selectedPartnerApp.pricingCpu.tax,
      };
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
