import { aapi } from '@ovh-ux/manager-core-api';
import i18next from 'i18next';
import { AxiosResponse } from 'axios';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { CatalogData, CatalogItem } from '@/types/catalog';

export const getCatalog: () => Promise<
  Record<string, CatalogItem[]>
> = async () => {
  const { data }: AxiosResponse<ApiEnvelope<CatalogData>> = await aapi.get<
    ApiEnvelope<CatalogData>
  >('/hub/catalog', {
    headers: {
      'Content-Language': i18next.language.replace('-', '_'),
    },
  });
  // Grouping items by universe while filtering non highlighted elements (as we don't want to display them)
  return (data?.data?.catalog.data || []).reduce(
    (
      groupedCatalogItems: Record<string, CatalogItem[]>,
      item: CatalogItem,
    ) => ({
      ...groupedCatalogItems,
      ...(item.highlight
        ? {
            [item.universe]: [
              ...(groupedCatalogItems[item.universe] || []),
              item,
            ],
          }
        : {}),
    }),
    {},
  );
};
