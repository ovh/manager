import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCloudCatalog } from '@/api/hooks/cloud-catalog';
import { useAvailableGatewayPlans } from '@/api/hooks/gateway-plans';
import { TCloudCatalogResponse } from '@/api/data/cloud-catalog';
import { TAvailableGatewayPlansResponse } from '@/api/data/gateway-plans';

const getMacroRegion = (region: string) => {
  const localZonePattern = /^lz/i;
  let macro: RegExpExecArray;
  if (
    localZonePattern.test(
      region
        .split('-')
        ?.slice(2)
        ?.join('-'),
    )
  ) {
    // The pattern for local zone is <geo_location>-LZ-<datacenter>-<letter>
    // geo_location is EU-WEST, EU-SOUTH, maybe ASIA-WEST in the future
    // datacenter: MAD, BRU
    macro = /\D{2,3}/.exec(
      region
        .split('-')
        ?.slice(3)
        ?.join('-'),
    );
  } else {
    macro = /\D{2,3}/.exec(region);
  }
  return macro ? macro[0].replace('-', '').toUpperCase() : '';
};

const getLitteralProductSize = (productName: string): string => {
  const [, size] = productName.match(/-([^-]+)$/) || [];
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

export const useData = (projectId: string) => {
  const { t: tSelector } = useTranslation('catalog-selector');
  const { t: tRegion } = useTranslation('regions');
  const { data: cloudCatalog } = useCloudCatalog();
  const { data: availableGatewayPlans } = useAvailableGatewayPlans(projectId);

  const [sizes, setSizes] = useState<TSizeItem[]>([]);

  useEffect(() => {
    if (availableGatewayPlans && cloudCatalog) {
      const gatewayPlansWithRegions = availableGatewayPlans.plans.filter(
        (plan) => plan.regions.length,
      );

      gatewayPlansWithRegions
        .reduce(
          (accumulator, currentValue) => {
            const addon = cloudCatalog.addons.find(
              ($addon) => $addon.planCode === currentValue.code,
            );
            const plansProductName = addon.product;

            const isHourly = addon.planCode.includes('hour');

            const foundProduct = accumulator.find(
              (product) => product.name === plansProductName,
            );

            if (foundProduct) {
              if (isHourly) {
                foundProduct.hourly = { addon, plan: currentValue };
              } else {
                foundProduct.monthly = { addon, plan: currentValue };
              }
            } else {
              const newProduct = isHourly
                ? {
                    name: plansProductName,
                    hourly: { addon, plan: currentValue },
                  }
                : {
                    name: plansProductName,
                    monthly: { addon, plan: currentValue },
                  };
              accumulator.push(newProduct);
            }
            return accumulator;
          },
          [] as {
            name: string;
            hourly?: {
              plan: TAvailableGatewayPlansResponse['plans'][0];
              addon: TCloudCatalogResponse['addons'][0];
            };
            monthly?: {
              plan: TAvailableGatewayPlansResponse['plans'][0];
              addon: TCloudCatalogResponse['addons'][0];
            };
          }[],
        )
        .forEach((product) => {
          const size: TSizeItem = {
            payload: getLitteralProductSize(product.name),
            label: `${tSelector(
              `pci_projects_project_gateways_model_selector_size`,
            )} ${getLitteralProductSize(product.name).toUpperCase()}`,
            bandwidth: product.hourly.addon.blobs.technical.bandwidth.level,
            bandwidthLabel: ((bandwidthLevel: number) =>
              bandwidthLevel > 1000
                ? tSelector(
                    `pci_projects_project_gateways_model_selector_bandwidth`,
                    { bandwidth: bandwidthLevel / 1000 },
                  ) +
                  tSelector(
                    'pci_projects_project_gateways_model_selector_bandwidth_unit_size_gbps',
                  )
                : tSelector(
                    `pci_projects_project_gateways_model_selector_bandwidth`,
                    { bandwidth: bandwidthLevel },
                  ) +
                  tSelector(
                    'pci_projects_project_gateways_model_selector_bandwidth_unit_size_mbps',
                  ))(product.hourly.addon.blobs.technical.bandwidth.level),
            hourlyPrice: product.hourly.addon.pricings.find((price) =>
              price.capacities.includes('consumption'),
            )?.price,
            monthlyPrice: product.monthly.addon.pricings.find((price) =>
              price.capacities.includes('consumption'),
            )?.price,
            availableRegions: product.monthly.plan?.regions.map((region) => ({
              name: region.name,
              datacenter: region.datacenter,
              continentCode: region.continentCode,
              enabled: region.enabled,
              // TODO inactive regions /cloud/project/${projectId}/regionAvailable
              active: false,
              macroName: getMacroRegion(region.name),
              microName: tRegion(
                `manager_components_region_${getMacroRegion(
                  region.name,
                )}_micro`,
                { micro: region.name },
              ),
              continent: tRegion(
                `manager_components_region_continent_${getMacroRegion(
                  region.name,
                )}`,
              ),
            })),
          };

          setSizes((prev) => [...prev, size]);
        });
    }
  }, [availableGatewayPlans, cloudCatalog]);

  return sizes.reverse();
};
