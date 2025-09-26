import React, { useMemo } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge, OdsCard, OdsIcon, OdsRadio, OdsText } from '@ovhcloud/ods-components/react';

import { ZimbraOffer } from '@/data/api';
import { capitalize, cn } from '@/utils';

export type PriceCardProps = {
  planCode: keyof typeof ZimbraOffer;
  isCurrentOffer: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  className?: string;
  onSelect: () => void;
};

export const PriceCard: React.FC<PriceCardProps> = ({
  planCode,
  isCurrentOffer,
  isSelected,
  isDisabled,
  className,
  onSelect,
}: PriceCardProps) => {
  const { t } = useTranslation(['accounts']);

  const features = useMemo(() => {
    let featureCount;
    if (planCode === ZimbraOffer.STARTER) {
      featureCount = 2;
    } else if (planCode === ZimbraOffer.PRO) {
      featureCount = 6;
    }

    return [
      `zimbra_account_plan_feature_storage_${planCode.toLowerCase()}`,
      'zimbra_account_plan_feature_share',
      'zimbra_account_plan_feature_sync',
      'zimbra_account_plan_feature_files_storage',
      'zimbra_account_plan_feature_co_edit',
      'zimbra_account_plan_feature_private_chat',
      'zimbra_account_plan_feature_team_chat',
      'zimbra_account_plan_feature_shared_storage',
      'zimbra_account_plan_feature_video_conferences',
    ].slice(0, featureCount);
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
    <OdsCard
      className={cn(
        'flex flex-col w-full border-2 cursor-pointer overflow-hidden',
        isSelected ? 'bg-color-primary-050 border-color-primary-500' : 'border-gray-300',
        isDisabled ? 'bg-gray-100' : '',
        className,
      )}
      onClick={() => !isDisabled && onSelect()}
    >
      <div className={cn('flex flex-col gap-4 p-6 border-b border-gray-300 min-h-24')}>
        <div className="flex gap-4 items-center">
          <OdsRadio name={planCode} isChecked={isSelected} onClick={() => false} />
          <OdsText preset="heading-4" className={cn(isDisabled && '[&::part(text)]:text-gray-500')}>
            {capitalize(planCode)}
          </OdsText>
        </div>
        <div className="flex gap-4">
          {tags?.map((tag) => (
            <OdsBadge
              key={tag}
              label={t(tag)}
              color={isDisabled ? ODS_BADGE_COLOR.neutral : ODS_BADGE_COLOR.new}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col p-6 flex-1 gap-4">
        {features.map((feature, index) => (
          <div className="flex items-center gap-8" key={index}>
            <OdsIcon name="check" className={cn(isDisabled ? 'text-gray-400' : 'text-green-600')} />
            <OdsText className={cn(isDisabled ? '[&::part(text)]:text-gray-400' : '')}>
              <Trans t={t} i18nKey={feature} />
            </OdsText>
          </div>
        ))}
      </div>
      <div
        className={cn(
          'flex flex-col px-6 py-8 overflow-hidden',
          isSelected ? 'bg-color-primary-100' : 'bg-gray-100',
          isDisabled ? 'bg-gray-200' : '',
        )}
      >
        <OdsText
          preset="heading-5"
          className={cn(isDisabled ? '[&::part(text)]:text-gray-500' : 'text-color-primary-500')}
        >
          {/* <Price
            value={renewPrice.price}
            tax={renewPrice.tax}
            intervalUnit={renewPrice?.intervalUnit}
            ovhSubsidiary={locale.subsidiary}
            locale={locale.subsidiary}
          ></Price> */}
        </OdsText>
      </div>
    </OdsCard>
  );
};

export default PriceCard;
