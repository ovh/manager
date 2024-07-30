import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TILE_SIZE, ODS_TILE_VARIANT } from '@ovhcloud/ods-components';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { convertHourlyPriceToMonthly } from '@/utils/commercial-catalog/utils';

const Commitment = ({
  duration,
  price,
  hourlyPriceWithoutCommitment,
  isActive,
  onClick,
}: {
  duration: number;
  price: string;
  hourlyPriceWithoutCommitment: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const priceByMonthWithoutCommitment = convertHourlyPriceToMonthly(
    hourlyPriceWithoutCommitment,
  );

  const priceNumber = Number(price);

  const diffInPercent = (
    ((Number(priceByMonthWithoutCommitment) - priceNumber) /
      Number(priceByMonthWithoutCommitment)) *
    100
  ).toFixed(0);

  const { t } = useTranslation('create');
  return (
    <OsdsTile
      size={ODS_TILE_SIZE.sm}
      rounded
      inline
      variant={ODS_TILE_VARIANT.stroked}
      className="flex flex-row items-center mr-5 my-4 justify-between w-full cursor-pointer"
      color={
        isActive
          ? ODS_THEME_COLOR_INTENT.primary
          : ODS_THEME_COLOR_INTENT.default
      }
      onClick={onClick}
    >
      <span slot="start" className="flex flex-row items-center justify-center">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('commitment_month', { value: duration })}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.success} className="ml-3">
          {diffInPercent} %
        </OsdsText>
      </span>
      <span slot="end" className="flex flex-col items-end justify-center">
        <div className="flex flex-row items-center justify-center">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="line-through"
          >
            ~ {priceByMonthWithoutCommitment.toFixed(2)} €
          </OsdsText>
          <OsdsText color={ODS_THEME_COLOR_INTENT.success} className="ml-3">
            {priceNumber.toFixed(2)} €
          </OsdsText>
        </div>
        <OsdsText>{t('commitment_price_month')}</OsdsText>
      </span>
    </OsdsTile>
  );
};

export default Commitment;
