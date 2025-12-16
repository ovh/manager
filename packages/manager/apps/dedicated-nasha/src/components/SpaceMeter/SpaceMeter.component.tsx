import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

interface SpaceMeterProps {
  usage: Record<string, { value: number; unit: string }>;
  maxSize: number;
}

export const SpaceMeter: React.FC<SpaceMeterProps> = ({ usage, maxSize }) => {
  const { t } = useTranslation('dashboard');

  const used = usage.used?.value || 0;
  const snapshot = usage.usedbysnapshots?.value || 0;
  const totalUsed = used + snapshot;
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
         <Text preset={TEXT_PRESET.span}>{t('nasha_dashboard_configuration_quota')}</Text>
         <Text preset={TEXT_PRESET.span}>{totalUsed} / {maxSize} {usage.size?.unit}</Text>
      </div>
      <ProgressBar
        max={maxSize}
        value={totalUsed}
        color={ODS_THEME_COLOR_INTENT.primary}
      />
    </div>
  );
};
