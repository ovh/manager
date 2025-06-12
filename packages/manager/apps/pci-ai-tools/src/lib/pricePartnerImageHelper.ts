import ai from '@/types/AI';
import publicCatalog from '@/types/Catalog';
import { AppPricing, ImagePartnerApp } from '@/types/orderFunnel';

export function createAppImagePricingList(
  appImage: ai.capabilities.app.Image[],
  partnerContract: ai.partner.Partner[],
  catalog: publicCatalog.Catalog,
): ImagePartnerApp[] {
  return appImage.map((app) => {
    let appCpuPlanCode = '';
    let appGpuPlanCode = '';

    if (
      app.licensing === ai.capabilities.LicensingTypeEnum['per-second-bracket']
    ) {
      appCpuPlanCode = `ai-${app.partnerName}.${app.id}-cpu-bracket1.unit.consumption`.toLocaleLowerCase();
      appGpuPlanCode = `ai-${app.partnerName}.${app.id}-gpu-bracket1.unit.consumption`.toLocaleLowerCase();
    } else {
      appCpuPlanCode = `ai-app.${app.partnerId}-${app.id}-cpu.minute.consumption`.toLocaleLowerCase();
      appGpuPlanCode = `ai-app.${app.partnerId}-${app.id}-gpu.minute.consumption`.toLocaleLowerCase();
    }

    const noPriceFound: AppPricing = {
      price: NaN,
      tax: NaN,
    };

    const appCpuPrice = catalog.addons?.find(
      (ad) => ad.planCode === appCpuPlanCode,
    )?.pricings;

    const appGpuPrice = catalog.addons?.find(
      (ad) => ad.planCode === appGpuPlanCode,
    )?.pricings;

    const contractPart: ai.partner.Contract = partnerContract?.find(
      (partner) => partner.id === app.partnerId,
    )?.contract;

    // if per-second-bracket, price must be * 60
    const pricingFactor =
      app.licensing === ai.capabilities.LicensingTypeEnum['per-second-bracket']
        ? 60
        : 1;

    return {
      ...app,
      contract: contractPart,
      pricingCpu: appCpuPrice
        ? {
            price: appCpuPrice[0]?.price * pricingFactor,
            tax: appCpuPrice[0]?.tax * pricingFactor,
          }
        : noPriceFound,
      pricingGpu: appGpuPrice
        ? {
            price: appGpuPrice[0]?.price * pricingFactor,
            tax: appGpuPrice[0]?.tax * pricingFactor,
          }
        : noPriceFound,
    };
  });
}
