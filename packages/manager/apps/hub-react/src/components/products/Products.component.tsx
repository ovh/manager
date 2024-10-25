import React, { Suspense, useState } from 'react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsButton,
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { Await, useSearchParams } from 'react-router-dom';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import punycode from 'punycode/punycode';
import { useQuery } from '@tanstack/react-query';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList } from '@/types/services.type';
import { useProducts } from '@/hooks/products/useProducts';
import './Products.style.scss';
import ServiceLink from '@/pages/layout/ServiceLink.component';

type ProductsProps = {
  services: ApiEnvelope<ProductList>;
};

export default function Products({ services }: ProductsProps) {
  const { t } = useTranslation('hub/products');
  const { t: tCommon } = useTranslation();
  const [searchParams] = useSearchParams();
  const [expand, setExpand] = useState(searchParams.get('expand') === 'true');
  const { trackClick } = useOvhTracking();

  const { products, canDisplayMore } = useProducts(services.data, expand);

  const trackServiceNavigation = (productType: string) => {
    trackClick({
      actionType: 'action',
      actions: ['product', productType, 'go-to-service'],
    });
  };
  const updateExpand = () => {
    console.log('clicked on expand / reduce');
    setExpand(!expand);
    trackClick({
      actionType: 'action',
      actions: ['product', 'show_more'],
    });
  };

  return (
    <>
      {products.length > 0 && (
        <OsdsText
          className="inline-block my-6"
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._500}
          hue={ODS_TEXT_COLOR_HUE._800}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="products_title"
        >
          {t('manager_hub_dashboard_services')}
        </OsdsText>
      )}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3 mb-4"
        data-testid="products-list-container"
      >
        {products.map((product) => (
          <div className="w-full" key={`product_${product.type}_services_list`}>
            <OsdsTile className="p-0">
              <div className="ovh-manager-hub-tile w-full flex flex-col p-6">
                <div className="flex mb-2 gap-4 items-start ovh-manager-hub-tile__header">
                  <OsdsText
                    className="block flex-1 mb-6"
                    level={ODS_TEXT_LEVEL.subheading}
                    size={ODS_TEXT_SIZE._200}
                    hue={ODS_TEXT_COLOR_HUE._800}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  >
                    {t(`manager_hub_products_${product.type}`)}
                    <OsdsChip
                      className="ml-4"
                      color={ODS_THEME_COLOR_INTENT.info}
                      size={ODS_CHIP_SIZE.sm}
                      inline={true}
                      data-testid="count_chip"
                    >
                      {product.count}
                    </OsdsChip>
                  </OsdsText>
                  {product.application && product.hash && (
                    <Suspense
                      fallback={
                        <OsdsSkeleton inline size={ODS_SKELETON_SIZE.xs} />
                      }
                    >
                      <ServiceLink
                        application={product.application}
                        hash={product.hash}
                        type={product.formattedType}
                      />
                    </Suspense>
                  )}
                </div>
                <div>
                  <ul
                    className="list-none m-0 p-0"
                    data-testid="product_services_list"
                  >
                    {product.data.map((service) => (
                      <li
                        className="services-list"
                        key={`${product.type}_service_${service.serviceId}`}
                      >
                        <OsdsLink
                          href={service.url}
                          color={ODS_THEME_COLOR_INTENT.primary}
                          onClick={() => {
                            trackServiceNavigation(product.formattedType);
                          }}
                          target={OdsHTMLAnchorElementTarget._top}
                          data-testid="service_link"
                        >
                          {punycode.toUnicode(
                            service.resource.displayName ||
                              service.resource.name,
                          )}
                        </OsdsLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </OsdsTile>
          </div>
        ))}
      </div>
      <div className="text-center">
        {canDisplayMore && (
          <OsdsButton
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            inline
            onClick={updateExpand}
            data-testid="expand_link"
          >
            <OsdsText
              slot="start"
              level={ODS_TEXT_LEVEL.button}
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t(
                expand
                  ? 'manager_hub_products_see_less'
                  : 'manager_hub_products_see_more',
              )}
            </OsdsText>
            <span slot="end">
              <OsdsIcon
                name={
                  expand ? ODS_ICON_NAME.CHEVRON_UP : ODS_ICON_NAME.CHEVRON_DOWN
                }
                size={ODS_ICON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.primary}
              ></OsdsIcon>
            </span>
          </OsdsButton>
        )}
      </div>
    </>
  );
}
