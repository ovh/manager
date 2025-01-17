import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_TILE_SIZE, ODS_TILE_VARIANT } from '@ovhcloud/ods-components';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { getDiffInPercent } from './Commitment.utils';
import {
  CENTS_PRICE,
  convertHourlyPriceToMonthly,
} from '../../utils/commercial-catalog/utils';

const Commitment = ({
  duration,
  price,
  hourlyPriceWithoutCommitment,
  isActive,
  onClick,
  quantity = 1,
}: {
  duration: number;
  price: string;
  hourlyPriceWithoutCommitment: number;
  isActive: boolean;
  onClick: () => void;
  quantity: number;
}) => {
  const { t } = useTranslation('create');
  const { trackClick } = useOvhTracking();
  const { getTextPrice } = useCatalogPrice();
  const priceByMonthWithoutCommitment =
    convertHourlyPriceToMonthly(hourlyPriceWithoutCommitment) * quantity;

  const priceNumber = Number(price) * quantity;

  const diffInPercent = getDiffInPercent(
    priceByMonthWithoutCommitment,
    priceNumber,
  );

  const onClickTracking = () => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [`add_savings_plan::add_billing::add_${duration}`],
    });
    onClick();
  };

  return (
    <OsdsTile
      size={ODS_TILE_SIZE.sm}
      rounded
      inline
      variant={ODS_TILE_VARIANT.stroked}
      className={`flex flex-row items-center mr-5 my-4 justify-between w-full cursor-pointer ${
        isActive
          ? 'bg-[--ods-color-blue-100] border-[--ods-color-blue-600]'
          : ''
      }`}
      color={
        isActive
          ? ODS_THEME_COLOR_INTENT.primary
          : ODS_THEME_COLOR_INTENT.default
      }
      onClick={onClickTracking}
    >
      <span slot="start" className="flex flex-row items-center justify-center">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('commitment_month', { value: duration })}
        </OsdsText>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          className="ml-3 text-[#AC246F]"
        >
          {diffInPercent ? `- ${diffInPercent} %` : ''}
        </OsdsText>
      </span>
      <span slot="end" className="flex flex-col items-end justify-center">
        <div className="flex flex-row items-center justify-center">
          {priceByMonthWithoutCommitment && (
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              className="line-through"
            >
              {`~ ${getTextPrice(priceByMonthWithoutCommitment * CENTS_PRICE)}`}
            </OsdsText>
          )}
          <OsdsText
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            className="ml-3 text-[#AC246F]"
          >
            {getTextPrice(priceNumber * CENTS_PRICE)}
          </OsdsText>
        </div>
        <OsdsText>{t('commitment_price_month')}</OsdsText>
      </span>
    </OsdsTile>
  );
};

export default Commitment;
