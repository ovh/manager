import { useTranslation } from 'react-i18next';
import { Card } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import React from 'react';
import TileGridSkeleton from '@/components/tile-grid-skeleton/TileGridSkeleton.component';
import { useFetchHubCatalog } from '@/data/hooks/catalog/useCatalog';
import { CatalogItem } from '@/types/catalog';

export default function Catalog() {
  const { t } = useTranslation('hub/catalog');
  const { isLoading, data: catalog } = useFetchHubCatalog();
  const { trackClick } = useOvhTracking();

  const trackProductOrder = (category: string, product: string) => {
    trackClick({
      actionType: 'action',
      actions: [
        'hub',
        'dashboard',
        'catalog',
        category.toLowerCase().replace(' ', '-'),
        product.toLowerCase().replace(/_/g, '-'),
      ],
    });
  };

  return (
    <>
      <OsdsText
        className="block my-6"
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._500}
        hue={ODS_THEME_COLOR_HUE._800}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-testid="catalog_title"
      >
        {t('manager_hub_catalog_title')}
      </OsdsText>
      <OsdsText
        className="block my-6"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.default}
      >
        {t('manager_hub_catalog_description')}
      </OsdsText>
      {isLoading && <TileGridSkeleton />}
      {!isLoading && catalog && Object.keys(catalog).length > 0 && (
        <>
          {Object.keys(catalog).map((category) => {
            const items = catalog[category];
            return (
              <div
                key={`${category}_products_list`}
                data-testid="catalog_products_list"
              >
                <OsdsText
                  className="block mb-4 mt-6"
                  level={ODS_TEXT_LEVEL.subheading}
                  size={ODS_TEXT_SIZE._200}
                  hue={ODS_THEME_COLOR_HUE._800}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  {category}
                </OsdsText>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5 pt-3">
                  {items.map((item: CatalogItem) => (
                    <Card
                      key={`${item.productName}-${item.universe}`}
                      data-testid="catalog_product_item"
                      texts={{
                        title: item.name,
                        category: item.category,
                        description: item.description,
                      }}
                      href={item.order}
                      hoverable
                      onClick={() =>
                        trackProductOrder(category, item.productName)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
