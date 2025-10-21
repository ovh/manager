import React from 'react';
import { useTranslation } from 'react-i18next';

import { OdsIcon, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { useBytes } from '@ovh-ux/manager-react-components';

import { StorageProgressBar } from './StorageProgressBar.component';
import type { SpaceMeterProps } from './SpaceMeter.types';

export const SpaceMeter = ({ usage, large = false, help = true, legend = false }: SpaceMeterProps) => {
  const { formatBytes } = useBytes();
  const { t } = useTranslation('dashboard');

  // Calculer les valeurs
  const totalSize = usage.size.value;
  const used = usage.used?.value || 0;
  const usedBySnapshots = usage.usedbysnapshots?.value || 0;
  const available = totalSize - used - usedBySnapshots;

  return (
    <div className="space-y-3">
      {/* Texte espace restant */}
      <div className="flex items-center gap-2">
        <OdsText
          preset={large ? "heading-4" : "paragraph"}
          className="font-semibold"
        >
          {formatBytes(used + usedBySnapshots)} {t('used')} / {formatBytes(totalSize)}
        </OdsText>
        {help && (
          <OdsPopover triggerId="space-meter-help">
            <OdsIcon
              name={ODS_ICON_NAME.question}
              className="cursor-pointer"
            />
            <div slot="content">
              {t('space_meter_help')}
            </div>
          </OdsPopover>
        )}
      </div>

      {/* Barre de progression multi-segments */}
      <StorageProgressBar
        totalSize={totalSize}
        used={used}
        usedBySnapshots={usedBySnapshots}
        large={large}
      />

      {/* Légende optionnelle */}
      {legend && (
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#64afa0] rounded" />
            <span>{t('data_usage')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ffcd00] rounded" />
            <span>{t('snapshots_usage')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
