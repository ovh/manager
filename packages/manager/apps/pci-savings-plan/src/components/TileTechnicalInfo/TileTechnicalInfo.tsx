import React from 'react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import SimpleTile from '../SimpleTile/SimpleTile';
import { Technical } from '@/data/api/commercial-catalog';

type TileTechnicalInfoProps = {
  technical: Technical;
  onClick?: () => void;
  isActive?: boolean;
};
export const TileTechnicalInfo: React.FC<TileTechnicalInfoProps> = ({
  technical,
  onClick,
  isActive,
}) => {
  const { t } = useTranslation('create');
  const { name, memory, cpu, storage, bandwidth } = technical;
  return (
    <SimpleTile key={name} onClick={onClick} isActive={isActive}>
      <div className="flex flex-col items-center justify-center">
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
          hue={ODS_THEME_COLOR_HUE._700}
          className="mb-5"
        >
          {name}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('resource_model_characteristics_gb', {
            value: memory.size,
          })}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('resource_model_characteristics_cpu', {
            cores: cpu.cores,
            ghz: cpu.frequency,
          })}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('resource_model_characteristics_disk', {
            value: storage.disks[0].capacity,
          })}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('resource_model_characteristics_mbits', {
            value: bandwidth.level,
          })}
        </OsdsText>
      </div>
    </SimpleTile>
  );
};
