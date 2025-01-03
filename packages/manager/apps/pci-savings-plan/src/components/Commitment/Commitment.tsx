import { OdsText, OdsCard } from '@ovhcloud/ods-components/react';
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

  const { getTextPrice } = useCatalogPrice();
  const priceByMonthWithoutCommitment =
    convertHourlyPriceToMonthly(hourlyPriceWithoutCommitment) * quantity;

  const priceNumber = Number(price) * quantity;

  const diffInPercent = getDiffInPercent(
    priceByMonthWithoutCommitment,
    priceNumber,
  );

  return (
    <OdsCard
      className={`flex flex-row items-center mr-5 my-4 p-5 justify-between w-full cursor-pointer ${
        isActive
          ? 'bg-[--ods-color-primary-050] border-[--ods-color-primary-500] border-2'
          : ''
      }`}
      onClick={onClick}
    >
      <span className="flex flex-row items-center justify-center">
        <OdsText>{t('commitment_month', { value: duration })}</OdsText>
        {diffInPercent && (
          <OdsText className="ml-3  text-[16px]">
            <span className="text-[#AC246F] font-bold">
              {`- ${diffInPercent} %`}
            </span>
          </OdsText>
        )}
      </span>
      <span className="flex flex-col items-end justify-center">
        <div className="flex flex-row items-center justify-center">
          {priceByMonthWithoutCommitment && (
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
