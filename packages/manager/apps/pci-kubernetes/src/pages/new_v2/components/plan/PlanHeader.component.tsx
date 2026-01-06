import { useTranslation } from 'react-i18next';

import { Icon, Radio, RadioControl, RadioLabel, Text } from '@ovhcloud/ods-react';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { isMultiDeploymentZones } from '@/helpers';
import { DeploymentMode, TClusterPlan } from '@/types';

export function PlanTileHeader({
  title,
  description,
  disabled,
  value,
  mode,
}: {
  selected: boolean;
  title: string;
  description: string;
  disabled: boolean;
  value: TClusterPlan;
  mode: DeploymentMode;
}) {
  const { t } = useTranslation(['add']);
  const displayWarningMessage = disabled;
  return (
    <div className=" px-6 py-4">
      <PciCard.Header>
        <Radio className="w-full" value={value} disabled={disabled}>
          <RadioControl />
          <RadioLabel className="text-lg font-bold text-[--ods-color-heading]">
            {t(title)}
          </RadioLabel>
        </Radio>
        <div className="flex flex-wrap gap-4">
          {displayWarningMessage && (
            <Text color="neutral" className="flex gap-2 font-semibold" preset="paragraph">
              <Icon name="circle-xmark" className="self-center" />
              {t('kube_add_plan_content_not_available_AZ', {
                mode: isMultiDeploymentZones(mode) ? '3-AZ' : '1-AZ',
              })}
            </Text>
          )}
        </div>

        <div className="mt-2 flex flex-wrap">
          <span className="text-[--ods-color-text-500]">{t(description)}</span>
        </div>
      </PciCard.Header>
    </div>
  );
}
