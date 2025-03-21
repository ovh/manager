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
      appCpuPlanCode = `ai-${app.partnerName.toLocaleLowerCase()}.${app.id.toLocaleLowerCase()}-cpu-bracket1.unit.consumption`;
      appGpuPlanCode = `ai-${app.partnerName.toLocaleLowerCase()}.${app.id.toLocaleLowerCase()}-gpu-bracket1.unit.consumption`;
    } else {
      appCpuPlanCode = `ai-app.${app.partnerId.toLocaleLowerCase()}-${app.id.toLocaleLowerCase()}-cpu.minute.consumption`;
      appGpuPlanCode = `ai-app.${app.partnerId.toLocaleLowerCase()}-${app.id.toLocaleLowerCase()}-gpu.minute.consumption`;
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

    return {
      ...app,
      contract: contractPart,
      pricingCpu: appCpuPrice
        ? {
            // if per-second-bracket, price must be * 60
            price:
              app.licensing ===
              ai.capabilities.LicensingTypeEnum['per-second-bracket']
                ? appCpuPrice[0]?.price * 60
                : appCpuPrice[0]?.price,
            tax:
              app.licensing ===
              ai.capabilities.LicensingTypeEnum['per-second-bracket']
                ? appCpuPrice[0]?.tax * 60
                : appCpuPrice[0]?.tax,
          }
        : noPriceFound,
      pricingGpu: appGpuPrice
        ? {
            // if per-second-bracket, price must be * 60
            price:
              app.licensing ===
              ai.capabilities.LicensingTypeEnum['per-second-bracket']
                ? appGpuPrice[0]?.price * 60
                : appGpuPrice[0]?.price,
            tax:
              app.licensing ===
              ai.capabilities.LicensingTypeEnum['per-second-bracket']
                ? appGpuPrice[0]?.tax * 60
                : appGpuPrice[0]?.tax,
          }
        : noPriceFound,
    };
  });
}
