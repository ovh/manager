import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import { TProductAddonDetail } from '@/types/product.type';

const DIGIT_AFTER_DECIMAL = 4;

export const LabelComponent = ({
  item,
}: Readonly<{
  item: TProductAddonDetail;
}>) => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(DIGIT_AFTER_DECIMAL);

  const [priceValue, monthlyPrice] = useMemo(
    () => [
      getFormattedHourlyCatalogPrice(item.price),
      getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(item.price)),
    ],
    [
      getFormattedHourlyCatalogPrice,
      getFormattedMonthlyCatalogPrice,
      item.price,
    ],
  );

  return (
    <div className="p-4">
      <OsdsText
        size={ODS_TEXT_SIZE._200}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tCreate('octavia_load_balancer_create_size_flavour_title', {
          sizeCode: item.size.toUpperCase(),
        })}{' '}
      </OsdsText>
      <div className="mt-4 font-normal">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tCreate(
            `octavia_load_balancer_create_size_flavour_description_${item.size}`,
          )}{' '}
        </OsdsText>
      </div>
      <div className="mt-4 pt-4 text-center border-solid border-t border-0 border-[--ods-color-blue-200]">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          <span className="font-bold">{priceValue}</span>
        </OsdsText>
      </div>
      <div className="text-center mt-2">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          ~ <span>{monthlyPrice}</span>
        </OsdsText>
      </div>
    </div>
  );
};
