import { FC } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useCatalogPrice } from '@ovh-ux/muk';
import { TPriceType } from '@/types/instance/common.type';

const MONTHLY_PRICE_TYPES: readonly TPriceType[] = ['month', 'licenceMonth'];

type TPriceLabelProps = {
  type: TPriceType;
  value: number;
};

const PriceLabel: FC<TPriceLabelProps> = ({ value, type }) => {
  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(3);

  return (
    <OsdsText
      className="my-4"
      size={ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {MONTHLY_PRICE_TYPES.includes(type)
        ? getFormattedMonthlyCatalogPrice(value)
        : getFormattedHourlyCatalogPrice(value)}
    </OsdsText>
  );
};

export default PriceLabel;
