import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import { cn } from '@/utils';

export type TotalPriceCardProps = {
  nextBilling: string;
  total: string;
  className?: string;
  isSending?: boolean;
  onUpgrade?: () => void;
};

export const TotalPriceCard: React.FC<TotalPriceCardProps> = ({
  nextBilling,
  total,
  className,
  isSending,
  onUpgrade,
}: TotalPriceCardProps) => {
  const { t } = useTranslation();
  return (
    <OdsCard
      className={cn('flex flex-col w-full h-max min-w-72 border-2 border-gray-300', className)}
    >
      <div className="flex flex-1 justify-between items-start pt-6 px-6">
        <OdsText preset="heading-6">{t('common:next_billing')}</OdsText>
        <div className="flex flex-col items-end">{nextBilling}</div>
      </div>
      <div className="flex flex-1 justify-between items-start pt-6 px-6">
        <div className="flex items-center">
          <OdsText preset="heading-6">{t('common:paid_now')}</OdsText>
          <OdsIcon className="ml-3" name={ODS_ICON_NAME.circleInfo} />
        </div>
        <div className="flex flex-col items-end">
          <OdsText preset="heading-6">{total}</OdsText>
        </div>
      </div>
      <div className="w-full p-6 justify-center">
        <OdsButton
          label={t('common:continue_order_btn')}
          className="w-full [&::part(button)]:w-full"
          icon={ODS_ICON_NAME.shoppingCart}
          iconAlignment="right"
          isLoading={isSending}
          onClick={onUpgrade}
        />
      </div>
    </OdsCard>
  );
};

export default TotalPriceCard;
