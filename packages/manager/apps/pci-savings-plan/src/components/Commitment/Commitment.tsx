import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsText, OdsCard } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import clsx from 'clsx';
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
    <OdsCard
      className={clsx(
        'flex flex-row items-center mr-5 my-4 p-5 justify-between w-full cursor-pointer border',
        {
          'border-[--ods-color-primary-500] border-2': isActive,
          'hover:border-2': !isActive,
        },
      )}
      onClick={onClickTracking}
      color="neutral"
    >
      <span className="flex flex-row items-center justify-center">
        <OdsText>{t('commitment_month', { value: duration })}</OdsText>
        {diffInPercent !== null && (
          <OdsText className="ml-3  text-[16px]">
            <span className="text-[#AC246F] font-bold">
              {`- ${diffInPercent} %`}
            </span>
          </OdsText>
        )}
      </span>
      <span className="flex flex-col items-end justify-center">
        <div className="flex flex-row items-center justify-center">
          {!!priceByMonthWithoutCommitment && (
            <OdsText className="line-through">
              {`~ ${getTextPrice(priceByMonthWithoutCommitment * CENTS_PRICE)}`}
            </OdsText>
          )}
          <OdsText className="ml-3  text-[16px]">
            <span className="text-[#AC246F] font-bold">
              {getTextPrice(priceNumber * CENTS_PRICE)}
            </span>
          </OdsText>
        </div>
        <OdsText>{t('commitment_price_month')}</OdsText>
      </span>
    </OdsCard>
  );
};

export default Commitment;
