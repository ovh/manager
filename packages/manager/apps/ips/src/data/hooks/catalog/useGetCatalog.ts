import { useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ApiError, apiClient } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const BYOIP_FAILOVER_V4 = 'byoip-failover-v4';
export const BYOIP_PRODUCT_ID = 'bringYourOwnIp';
export const CONFIG_NAME = {
  CAMPUS: 'campus',
  IPRIR: 'ipRir',
} as const;

export type Campus = {
  name: string;
  planCode: string;
};

// Extract the RIR from a byoip plan code, e.g. "byoip-failover-v4-arin" -> "ARIN".
// Returns an empty string when the plan code cannot be decoded.
export const getRirFromPlanCode = (planCode: string): string => {
  if (!planCode?.startsWith(`${BYOIP_FAILOVER_V4}-`)) return '';
  return planCode.slice(BYOIP_FAILOVER_V4.length + 1).toUpperCase();
};

export type ProductConfiguration = {
  name: string;
  values: string[] | Campus[];
};

export type Product = {
  description: string;
  internalType: string;
  name: string;
  configurations: ProductConfiguration[];
};

export type PlanDetails = {
  metadatas: Record<string, unknown>;
  pricings: Record<string, unknown>;
  product: Product;
};

export type Plan = {
  addonsFamily: string;
  consumptionBillingStrategy: string;
  details: PlanDetails;
  invoiceName: string;
  pricingType: string;
  planCode: string;
};

export type CatalogResponse = {
  plans: Plan[];
};

export const useGetCatalog = () => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;

  return useQuery<Plan, ApiError>({
    queryKey: ['catalog', 'bringYourOwnIp'],
    queryFn: async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();

      const { data } = await apiClient.v6.get<CatalogResponse>(
        '/order/catalog/formatted/bringYourOwnIp',
        {
          params: {
            ovhSubsidiary,
          },
        },
      );

      const campusList: Campus[] = [];
      let plan: Plan | null = null;

      data.plans.forEach((el) => {
        if (el.planCode.startsWith(BYOIP_FAILOVER_V4)) {
          if (!plan) {
            plan = {
              addonsFamily: el.addonsFamily,
              consumptionBillingStrategy: el.consumptionBillingStrategy,
              details: {
                metadatas: el.details.metadatas,
                pricings: el.details.pricings,
                product: {
                  description: el.details.product.description,
                  internalType: el.details.product.internalType,
                  name: el.details.product.name,
                  configurations: [
                    el.details.product.configurations.find(
                      ({ name }) => name === 'asNumber',
                    ),
                    el.details.product.configurations.find(
                      ({ name }) => name === 'asRir',
                    ),
                    el.details.product.configurations.find(
                      ({ name }) => name === 'ip',
                    ),
                    el.details.product.configurations.find(
                      ({ name }) => name === 'ipRir',
                    ),
                    el.details.product.configurations.find(
                      ({ name }) => name === CONFIG_NAME.CAMPUS,
                    ),
                  ].filter(Boolean),
                },
              },
              invoiceName: el.invoiceName,
              pricingType: el.pricingType,
              planCode: el.planCode,
            };
          }

          const campus = el.details.product.configurations.filter(
            (conf) => conf.name === CONFIG_NAME.CAMPUS,
          );

          campus.forEach((elem) => {
            elem.values.forEach((val) => {
              const values: Campus = {
                name: val as string,
                planCode: el.planCode,
              };
              campusList.push(values);
            });
          });
        }
      });

      if (plan) {
        const index = plan.details.product.configurations.findIndex(
          ({ name }) => name === CONFIG_NAME.CAMPUS,
        );
        if (index !== -1 && plan?.details?.product?.configurations?.[index]) {
          plan.details.product.configurations[index].values = campusList;
        }

        // On some subsidiaries (e.g. US) the catalog does not expose an ipRir
        // configuration. In that case we derive the available RIRs from the
        // campus plan codes so the RIR selection step is still usable.
        const ipRirIndex = plan.details.product.configurations.findIndex(
          ({ name }) => name === CONFIG_NAME.IPRIR,
        );
        const derivedIpRirValues = Array.from(
          new Set(
            campusList
              .map(({ planCode }) => getRirFromPlanCode(planCode))
              .filter(Boolean),
          ),
        );

        if (ipRirIndex === -1) {
          if (derivedIpRirValues.length > 0) {
            plan.details.product.configurations.push({
              name: CONFIG_NAME.IPRIR,
              values: derivedIpRirValues,
            });
          }
        } else {
          const existingValues =
            (plan.details.product.configurations[ipRirIndex]
              .values as string[]) || [];
          if (existingValues.length === 0) {
            plan.details.product.configurations[ipRirIndex].values =
              derivedIpRirValues;
          }
        }
      }

      return plan as unknown as Plan;
    },
  });
};
