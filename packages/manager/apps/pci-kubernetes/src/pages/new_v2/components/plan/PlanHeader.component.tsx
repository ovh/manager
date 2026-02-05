import { useTranslation } from 'react-i18next';

import { Icon, Radio, RadioControl, RadioLabel, Text } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';

import { TPlanTile } from '../../view-models/plans.viewmodel';

type TPlanTileHeaderProps = {
  title: string;
  description: string;
  disabled: boolean;
  value: TPlanTile['planType'];
  isMultiZone: boolean;
};

export function PlanTileHeader({
  title,
  description,
  disabled,
  value,
  isMultiZone,
}: TPlanTileHeaderProps) {
  const { t } = useTranslation(['add']);
  const displayWarningMessage = disabled;
  return (
    <PciCard.Header className="gap-0">
      <Radio className="w-full" value={value} disabled={disabled}>
        <RadioControl />
        <RadioLabel className="text-lg font-bold text-[--ods-color-heading]">{t(title)}</RadioLabel>
      </Radio>
      {displayWarningMessage && (
        <div className="mt-5 flex flex-wrap gap-4">
          <Text color="neutral" className="flex gap-2 font-semibold" preset="paragraph">
            <Icon name="circle-xmark" className="self-center" />
            {isMultiZone
              ? t('kube_add_plan_content_not_available_AZ', {
                  mode: '3-AZ',
                })
              : t('kube_add_plan_content_not_available_region')}
          </Text>
        </div>
      )}

      <div className="mt-6 flex flex-wrap">
        <span className="text-[--ods-color-text-500]">{t(description)}</span>
      </div>
    </PciCard.Header>
  );
}
