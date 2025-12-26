import React, { useMemo } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  Badge,
  Card,
  ICON_NAME,
  Icon,
  Radio,
  RadioControl,
  RadioGroup,
  Skeleton,
  TEXT_PRESET,
  TOOLTIP_POSITION,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { OvhSubsidiary, Price } from '@ovh-ux/muk';

import { businessFeatures, proFeatures, starterFeatures } from '@/constants';
import { ZimbraOffer, order } from '@/data/api';
import { capitalize, cn } from '@/utils';

export type PriceCardProps = {
  planCode: keyof typeof ZimbraOffer;
  price: order.publicOrder.Pricing;
  locale?: string;
  subsidiary: OvhSubsidiary;
  isLoading: boolean;
  isCurrentOffer: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  className?: string;
  onSelect: () => void;
};

export const PriceCard: React.FC<PriceCardProps> = ({
  planCode,
  price,
  subsidiary,
  locale,
  isLoading,
  isCurrentOffer,
  isSelected,
  isDisabled,
  className,
  onSelect,
}: PriceCardProps) => {
  const { t } = useTranslation(['accounts']);

  const features = useMemo(() => {
    switch (planCode) {
      case ZimbraOffer.STARTER:
        return starterFeatures;
      case ZimbraOffer.PRO:
        return proFeatures;
      case ZimbraOffer.BUSINESS:
        return businessFeatures;
      default:
        return [];
    }
  }, [planCode]);

  const tags = useMemo(() => {
    const currentTags = [];
    if (isCurrentOffer) {
      currentTags.push('zimbra_account_plan_tag_current_offer');
    }
    if (planCode === ZimbraOffer.PRO) {
      currentTags.push('zimbra_account_plan_tag_new');
    }
    if (planCode === ZimbraOffer.BUSINESS) {
      currentTags.push('zimbra_account_plan_tag_coming_soon');
    }
    return currentTags;
  }, [isCurrentOffer, planCode]);

  return (
    <Card
      className={cn(
        'flex flex-col w-full border-2 cursor-pointer overflow-hidden',
        isSelected ? 'bg-color-primary-050 border-color-primary-500' : 'border-gray-300',
        isDisabled ? 'bg-gray-100' : '',
        className,
      )}
      onClick={() => !isDisabled && onSelect()}
    >
      <div
        className={cn(
          'flex flex-col gap-4 p-6 border-0 border-b border-solid border-gray-300 min-h-16',
        )}
      >
        <div className="flex items-center gap-4">
          <RadioGroup value={isSelected ? 'selected' : ''}>
            <Radio value="selected" onClick={() => false}>
              <RadioControl />
            </Radio>
          </RadioGroup>
          <Text preset="heading-4" className={cn(isDisabled && '[&::part(text)]:text-gray-500')}>
            {capitalize(planCode)}
          </Text>
        </div>
        <div className="flex gap-4">
          {tags?.map((tag) => (
            <Badge key={tag} color={isDisabled ? BADGE_COLOR.neutral : BADGE_COLOR.new}>
              {t(tag)}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        {features.map((feature, index) => (
          <div className="flex items-center gap-8" key={index}>
            <Icon
              name={ICON_NAME.check}
              className={cn(isDisabled ? 'text-gray-400' : 'text-green-600')}
            />
            <Text className={cn(isDisabled ? '[&::part(text)]:text-gray-400' : '')}>
              <Trans t={t} i18nKey={feature.label} />
              {feature.tooltip && (
                <Tooltip position={TOOLTIP_POSITION.bottom}>
                  <TooltipTrigger asChild>
                    <Icon
                      id={feature.tooltip}
                      className="ml-3 size-6"
                      name={ICON_NAME.circleQuestion}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-96 text-center" withArrow>
                    <Text className="mb-4" preset={TEXT_PRESET.paragraph}>
                      {t(feature.tooltip)}
                    </Text>
                  </TooltipContent>
                </Tooltip>
              )}
            </Text>
          </div>
        ))}
      </div>
      <div
        className={cn(
          'flex flex-col px-6 py-8 overflow-hidden min-h-9',
          isSelected ? 'bg-color-primary-100' : 'bg-gray-100',
          isDisabled ? 'bg-gray-200' : '',
        )}
      >
        {isLoading ? (
          <Skeleton data-testid="price-loading" className="[&::part(skeleton)]:w-16" />
        ) : (
          price && (
            <Text
              preset="heading-5"
              className={cn(
                isDisabled ? '[&::part(text)]:text-gray-500' : 'text-color-primary-500',
              )}
            >
              <Price
                value={price.price}
                tax={price.tax}
                intervalUnit={price?.intervalUnit}
                ovhSubsidiary={subsidiary}
                locale={locale}
              ></Price>
            </Text>
          )
        )}
      </div>
    </Card>
  );
};

export default PriceCard;
