import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TPlanPricing } from '@/hooks/planCreation/usePlanPricing';
import { PromotionPrice, OriginalPrice } from './PromotionPrice';
import CommitmentMonth from './CommitmentMonth';

type TCommitment = {
  planPricing: TPlanPricing;
  isActive: boolean;
  onClick: () => void;
};

const Commitment: React.FC<TCommitment> = ({
  planPricing,
  isActive,
  onClick,
}) => {
  const { t } = useTranslation('create');
  const { trackClick } = useOvhTracking();

  const {
    monthlyPrice,
    monthlyPercentageDiscount,
    duration,
    monthlyPriceWithoutDiscount,
  } = planPricing;

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
        <CommitmentMonth duration={duration} />
        {monthlyPercentageDiscount !== null && (
          <PromotionPrice price={`- ${monthlyPercentageDiscount} %`} />
        )}
      </span>
      <span className="flex flex-col items-end justify-center">
        <div className="flex flex-row items-center justify-center">
          {!!monthlyPriceWithoutDiscount && (
            <OriginalPrice price={`~ ${monthlyPriceWithoutDiscount}`} />
          )}
          <PromotionPrice price={monthlyPrice} />
        </div>
        <OdsText>{t('commitment_price_month')}</OdsText>
      </span>
    </OdsCard>
  );
};

export default Commitment;
