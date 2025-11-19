import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsIcon, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { Price as PriceType } from '@ovh-ux/manager-module-order';
import { OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';
import {
  TEXT_PRESET,
  TOOLTIP_POSITION,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovh-ux/muk';

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
      <div className="flex flex-1 gap-6 justify-between items-start pt-6 px-6">
        <Text preset="heading-6">{t('common:next_billing')}</Text>
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
        <div className="flex flex-1 gap-6 justify-between items-start pt-6 px-6">
          <div className="flex items-center">
            <Text preset="heading-6">{t('common:paid_now')}</Text>
            <Tooltip position={TOOLTIP_POSITION.bottom}>
              <TooltipTrigger asChild>
                <OdsIcon className="ml-3" name={ODS_ICON_NAME.circleInfo} />
              </TooltipTrigger>
              <TooltipContent className="max-w-96 text-center" withArrow>
                <Text className="mb-4" preset={TEXT_PRESET.heading6}>
                  {t('zimbra_account_update_offer_paid_now_tooltip')}
                </Text>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col items-end">
            {isLoading ? (
              <OdsSkeleton data-testid="total-price-loading" className="[&::part(skeleton)]:w-12" />
            ) : (
              <Text preset="heading-6">
                <Price value={total?.value || 0} ovhSubsidiary={subsidiary} locale={locale}></Price>
              </Text>
            )}
          </div>
        </div>
      )}
      <div className="w-[calc(100%-2rem)] p-6 justify-center">
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
