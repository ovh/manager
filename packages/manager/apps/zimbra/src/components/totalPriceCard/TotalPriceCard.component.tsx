import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Card,
  ICON_NAME,
  Icon,
  Skeleton,
  TEXT_PRESET,
  TOOLTIP_POSITION,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { Price as PriceType } from '@ovh-ux/manager-module-order';
import { OvhSubsidiary, Price } from '@ovh-ux/muk';

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
    <Card className={cn('flex flex-col w-full h-max min-w-72 border-2 border-gray-300', className)}>
      <div className="flex flex-1 items-start justify-between gap-6 px-6 pt-6">
        <Text preset="heading-6">{t('common:next_billing')}</Text>
        <div className="flex flex-col items-end">
          {isLoading ? (
            <Skeleton data-testid="next-billing-loading" className="[&::part(skeleton)]:w-12" />
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
            <Text preset="heading-6">{t('common:paid_now')}</Text>
            <Tooltip position={TOOLTIP_POSITION.bottom}>
              <TooltipTrigger asChild>
                <Icon className="ml-3" name={ICON_NAME.circleInfo} />
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
              <Skeleton data-testid="total-price-loading" className="[&::part(skeleton)]:w-12" />
            ) : (
              <Text preset="heading-6">
                <Price value={total?.value || 0} ovhSubsidiary={subsidiary} locale={locale}></Price>
              </Text>
            )}
          </div>
        </div>
      )}
      <div className="w-[calc(100%-2rem)] justify-center p-6">
        <Button
          className="w-full [&::part(button)]:w-full"
          loading={isSending}
          disabled={isCurrentOffer}
          onClick={onUpgrade}
        >
          <span>
            {t('common:continue_order_btn')}
            <Icon className="ml-3" name={ICON_NAME.shoppingCart} />
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default TotalPriceCard;
