import { useEffect, useState } from 'react';
import get from 'lodash.get';
import { useRegions } from '@/api/hooks/useRegions';
import { REGIONS } from '@/pages/order/constants';
import { useMe } from '@/api/hooks/useMe';
import { TCountry } from '@/api/types';
import { useIpCatalog } from '@/api/hooks/catalog/useIpCatalog';

export const useCountries = (projectId: string, regionName: string) => {
  const [countries, setCountries] = useState<TCountry[]>([]);
  const { me } = useMe();

  const { isPending: isRegionsPending, data: regions } = useRegions(projectId);
  const { isPending: isProductsPending, data: products } = useIpCatalog();

  useEffect(() => {
    if (regions && products) {
      const plansProducts = products.plans.filter(
        (plan) =>
          /failover/.test(plan.planCode) &&
          REGIONS[regionName].some((region: string) =>
            plan.invoiceName.includes(region),
          ),
      );
      /** ** */
      const countryToRegionsMapping = {};
      regions.forEach((region) => {
        region.ipCountries.forEach((country) => {
          if (countryToRegionsMapping[country]) {
            countryToRegionsMapping[country].push(region.name);
          } else {
            countryToRegionsMapping[country] = [region.name];
          }
        });
      });
      const availableCountries = Object.keys(countryToRegionsMapping);
      /** ***** */
      const newCountries: TCountry[] = (plansProducts.reduce((acc, product) => {
        const configObj = get(
          product,
          'details.product.configurations',
          [],
        ).find(
          (configuration: { name: string }) => configuration.name === 'country',
        );
        configObj.values.forEach((country: string) => {
          if (availableCountries.includes(country.toLowerCase())) {
            acc.push({
              name: country,
              planCode: product.planCode,
              regionNames: [],
            });
          }
        });
        return acc;
      }, []) as TCountry[]).map((country) => ({
        ...country,
        regionNames: regions
          .filter((region) =>
            region.ipCountries
              .map((ipCountry) => ipCountry.toLowerCase())
              .includes(country.name.toLowerCase()),
          )
          .map((region) => region.name),
      }));

      setCountries(() => newCountries);
    }
  }, [regions, products, me]);

  return {
    isPending: isRegionsPending || isProductsPending,
    countries,
  };
};
