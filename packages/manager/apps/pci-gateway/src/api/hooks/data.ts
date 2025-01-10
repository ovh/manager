import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMacroRegion } from '@ovh-ux/manager-react-components';
import { TAddon } from '@ovh-ux/manager-pci-common';
import { useCloudCatalog } from '@/api/hooks/cloud-catalog';
import { useAvailableGatewayPlans } from '@/api/hooks/gateway-plans';
import { TPlan, TPlanRegion } from '@/api/data/gateway-plans';
import { RegionType } from '@/types/region';

const getLitteralProductSize = (productName: string): string => {
  const [, size] = /-([^-]+)$/.exec(productName) || [];
  return size || '';
};

export type TAvailableRegion = {
  name: string;
  datacenter: string;
  continentCode: string;
  enabled: boolean;
  active: boolean;
  macroName: string;
  microName: string;
  continent: string;
  type: RegionType;
};

export type TSizeItem = {
  payload: string;
  label: string;
  bandwidth: number;
  bandwidthLabel: string;
  hourlyPrice: number;
  monthlyPrice: number;
  availableRegions: TAvailableRegion[];
};

export type TAvailablePlansGrouped = {
  [key: string]: { code: string; regions: TPlanRegion[] };
};

const getPrice = (addon: TAddon): number | undefined =>
  addon?.pricings.find((price) => price.capacities.includes('consumption'))
    ?.price;

export const useData = (projectId: string) => {
  const { t } = useTranslation(['catalog-selector', 'regions']);
  const { data: cloudCatalog } = useCloudCatalog();
  const { data: availableGatewayPlans } = useAvailableGatewayPlans(projectId);

  const getBandWidthLabel = (bandwidth: number) =>
    bandwidth > 1000
      ? t(`pci_projects_project_gateways_model_selector_bandwidth`, {
          bandwidth: bandwidth / 1000,
        }) +
        t(
          'pci_projects_project_gateways_model_selector_bandwidth_unit_size_gbps',
        )
      : t(`pci_projects_project_gateways_model_selector_bandwidth`, {
          bandwidth,
        }) +
        t(
          'pci_projects_project_gateways_model_selector_bandwidth_unit_size_mbps',
        );

  const mergedRegionPlan = useMemo(
    () =>
      availableGatewayPlans?.plans.reduce(
        (result: TAvailablePlansGrouped, currentValue: TPlan) => {
          const code = currentValue.code.replace(/\.3AZ$/, '');
          const newResult = { ...result };

          if (newResult[code]) {
            newResult[code] = {
              code,
              regions: [...newResult[code].regions, ...currentValue.regions],
            };
          } else {
            newResult[code] = currentValue;
          }

          return newResult;
        },
        {},
      ),
    [availableGatewayPlans],
  );

  const gatewayRefPlans = useMemo(
    () =>
      mergedRegionPlan
        ? Object.values(mergedRegionPlan).filter((plan) =>
            plan.code.includes('hour'),
          )
        : [],
    [mergedRegionPlan],
  );

  const sizes: TSizeItem[] = useMemo(() => {
    if (cloudCatalog) {
      return gatewayRefPlans.map((plan) => {
        const addonHourly = cloudCatalog.addons.find(
          ($addon) => $addon.planCode === plan.code,
        );

        const addonMonthly = cloudCatalog.addons.find(
          ($addon) => $addon.planCode === plan.code.replace('hour', 'month'),
        );

        const hourlyPrice = getPrice(addonHourly);
        const monthlyPrice = getPrice(addonMonthly);

        return {
          payload: getLitteralProductSize(addonHourly.product),
          label: `${t(
            `pci_projects_project_gateways_model_selector_size`,
          )} ${getLitteralProductSize(addonHourly.product).toUpperCase()}`,
          bandwidth: addonHourly.blobs.technical.bandwidth.level,
          bandwidthLabel: getBandWidthLabel(
            addonHourly.blobs.technical.bandwidth.level,
          ),
          hourlyPrice,
          monthlyPrice,
          availableRegions: plan.regions.map((region) => ({
            ...region,
            macroName: t(
              `regions:manager_components_region_${getMacroRegion(
                region.name,
              )}`,
            ),
            microName: t(
              `regions:manager_components_region_${getMacroRegion(
                region.name,
              )}_micro`,
              { micro: region.name },
            ),
            continent: t(
              `regions:manager_components_region_continent_${getMacroRegion(
                region.name,
              )}`,
            ),
          })) as TAvailableRegion[],
        };
      });
    }

    return [];
  }, [gatewayRefPlans, cloudCatalog]);

  return sizes.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
};
