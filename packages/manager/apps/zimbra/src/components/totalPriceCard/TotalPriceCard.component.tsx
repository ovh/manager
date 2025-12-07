import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsIcon,
  OdsSkeleton,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { Price as PriceType } from '@ovh-ux/manager-module-order';
import { OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';

import { order } from '@/data/api';
import { cn } from '@/utils';

export type TotalPriceCardProps = {
  nextBilling: order.publicOrder.Pricing;
  total: PriceType;
  className?: string;
  isLoading: boolean;
  isSending?: boolean;
  isCurrentOffer?: boolean;
  locale?: string;
  subsidiary: OvhSubsidiary;
  onUpgrade?: () => void;
};

export const TotalPriceCard: React.FC<TotalPriceCardProps> = ({
  nextBilling,
  total,
  className,
  isLoading,
  isSending,
  isCurrentOffer,
  locale,
  subsidiary,
  onUpgrade,
}: TotalPriceCardProps) => {
  const { t } = useTranslation(['accounts']);
  return (
    <OdsCard
      className={cn('flex flex-col w-full h-max min-w-72 border-2 border-gray-300', className)}
    >
      <div className="flex flex-1 items-start justify-between gap-6 px-6 pt-6">
        <OdsText preset="heading-6">{t('common:next_billing')}</OdsText>
        <div className="flex flex-col items-end">
          {isLoading ? (
            <OdsSkeleton data-testid="next-billing-loading" className="[&::part(skeleton)]:w-12" />
          ) : (
            nextBilling && (
              <Price
                value={nextBilling.price}
                tax={nextBilling.tax}
                intervalUnit={nextBilling?.intervalUnit}
                ovhSubsidiary={subsidiary}
                locale={locale}
              ></Price>
            )
          )}
        </div>
      </div>
      {!isCurrentOffer && (
        <div className="flex flex-1 items-start justify-between gap-6 px-6 pt-6">
          <div className="flex items-center">
            <OdsText preset="heading-6">{t('common:paid_now')}</OdsText>
            <OdsIcon id="paid-now-info" className="ml-3" name={ODS_ICON_NAME.circleInfo} />
            <OdsTooltip
              className="max-w-96 text-center"
              role="tooltip"
              withArrow
              triggerId="paid-now-info"
              position="bottom"
            >
              <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading6}>
                {t('zimbra_account_update_offer_paid_now_tooltip')}
              </OdsText>
            </OdsTooltip>
          </div>
          <div className="flex flex-col items-end">
            {isLoading ? (
              <OdsSkeleton data-testid="total-price-loading" className="[&::part(skeleton)]:w-12" />
            ) : (
              <OdsText preset="heading-6">
                <Price value={total?.value || 0} ovhSubsidiary={subsidiary} locale={locale}></Price>
              </OdsText>
            )}
          </div>
        </div>
      )}
      <div className="w-[calc(100%-2rem)] justify-center p-6">
        <OdsButton
          label={t('common:continue_order_btn')}
          className="w-full [&::part(button)]:w-full"
          icon={ODS_ICON_NAME.shoppingCart}
          iconAlignment="right"
          isLoading={isSending}
          isDisabled={isCurrentOffer}
          onClick={onUpgrade}
        />
      </div>
    </OdsCard>
  );
};

export default TotalPriceCard;
