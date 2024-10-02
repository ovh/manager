import { useQueries } from '@tanstack/react-query';
import { useMe } from '../../../../../../manager-react-components/src/lib';
import {
  getProductsAvailabilities,
  ProductPlan,
} from '../data/product-availability';
import { getCatalogQuery } from './useCatalog';
import { TAddon } from '../data/catalog';

export type TProduct = TAddon & Pick<ProductPlan, 'regions'>;

export const getProductAvailabilityByAddonQuery = (
  projectId: string,
  ovhSubsidiary: string,
  addonFamily: string,
) => ({
  queryKey: [
    'project',
    projectId,
    'capabilities',
    'productAvailability',
    addonFamily,
  ],
  queryFn: () =>
    getProductsAvailabilities(projectId, ovhSubsidiary, { addonFamily }),
});

export const useProductAvailabilities = (
  projectId: string,
  addonFamily: string,
): { products: TProduct[]; isLoading: boolean } => {
  /* const { t } = useTranslation('pci-region-selector');
  const {
    translateMicroRegion,
    translateMacroRegion,
    translateContinentRegion,
  } = useTranslatedMicroRegions(); */

  const { me } = useMe();

  const { data: products, isLoading } = useQueries({
    queries: [
      {
        ...getProductAvailabilityByAddonQuery(
          projectId,
          me?.ovhSubsidiary,
          addonFamily,
        ),
        enabled: !!me,
      },
      { ...getCatalogQuery(me?.ovhSubsidiary), enabled: !!me },
    ],
    combine: (results) => {
      let data: TProduct[];
      const [
        { data: productAvailabilityData },
        { data: catalogData },
      ] = results;

      if (productAvailabilityData && catalogData) {
        const addonsIds = catalogData.plans
          .find((p) => p.planCode === 'project')
          .addonFamilies.find((family) => family.name === addonFamily).addons;

        data = catalogData.addons
          .filter((addon) => addon.planCode.includes('consumption'))
          .filter((addon) => addonsIds.includes(addon.planCode))
          .filter((addon) =>
            productAvailabilityData.plans.find(
              (p) => p.code === addon.planCode,
            ),
          )
          .map<TProduct>((addon) => {
            const product = productAvailabilityData.plans.find(
              (p) => p.code === addon.planCode,
            );
            return {
              ...addon,
              regions: product.regions,
            };
          });
      }

      return {
        data,
        isLoading: results.some((r) => r.isLoading) || !data,
      };
    },
  });

  return {
    products,
    isLoading,
  };
};
