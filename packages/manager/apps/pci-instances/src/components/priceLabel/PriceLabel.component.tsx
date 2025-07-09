import { FC } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

type TPriceLabelProps = {
  type: 'hour' | 'month' | 'licence' | string;
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
      {type === 'month'
        ? getFormattedMonthlyCatalogPrice(value)
        : getFormattedHourlyCatalogPrice(value)}
    </OsdsText>
  );
};

export default PriceLabel;
