import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMacroRegion } from '@ovh-ux/manager-react-components';
import { TCatalog } from '@ovh-ux/manager-pci-common';
import { useCloudCatalog } from '@/api/hooks/cloud-catalog';
import { useAvailableGatewayPlans } from '@/api/hooks/gateway-plans';
import { TAvailableGatewayPlansResponse } from '@/api/data/gateway-plans';

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
  type: string;
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
  const { i18n, t: tSelector } = useTranslation('catalog-selector');
  const { t: tRegion } = useTranslation('regions');
  const { data: cloudCatalog } = useCloudCatalog();
  const { data: availableGatewayPlans } = useAvailableGatewayPlans(projectId);

  const [sizes, setSizes] = useState<TSizeItem[]>([]);

  useEffect(() => {
    if (availableGatewayPlans && cloudCatalog) {
      const gatewayPlansWithRegions = availableGatewayPlans.plans.filter(
        (plan) => plan.regions.length,
      );

      const newSizes = gatewayPlansWithRegions
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
              addon: TCatalog['addons'][0];
            };
            monthly?: {
              plan: TAvailableGatewayPlansResponse['plans'][0];
              addon: TCatalog['addons'][0];
            };
          }[],
        )
        .map((product) => {
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
              active: region.enabled,
              macroName: tRegion(
                `manager_components_region_${getMacroRegion(region.name)}`,
              ),
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
              type: region.type,
            })),
          };
          return size;
        });

      setSizes(newSizes?.sort((a, b) => a.monthlyPrice - b.monthlyPrice));
    }
  }, [availableGatewayPlans, cloudCatalog, i18n]);

  return sizes;
};
