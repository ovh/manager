import React from 'react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import SimpleTile from '../SimpleTile/SimpleTile';
import { formatTechnicalInfo } from '@/utils/formatter/formatter';

const DisplayTechnicalInfo = ({
  technical,
}: {
  technical: ReturnType<typeof formatTechnicalInfo>['technical'];
}) => {
  const { t } = useTranslation('create');
  const { memory, cpu, storage, bandwidth } = technical;
  return (
    <>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
      >
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
    </>
  );
};

type TileTechnicalInfoProps = {
  technical: ReturnType<typeof formatTechnicalInfo>['technical'];
  onClick?: () => void;
  isActive?: boolean;
  name: string;
};

export const TileTechnicalInfo: React.FC<TileTechnicalInfoProps> = ({
  name,
  technical,
  onClick,
  isActive,
}) => (
  <SimpleTile onClick={onClick} isActive={isActive}>
    <div className="flex flex-col items-center justify-center">
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        color={ODS_THEME_COLOR_INTENT.text}
        hue={ODS_THEME_COLOR_HUE._700}
        className="mb-5"
      >
        {name}
      </OsdsText>
      {technical && technical.bandwidth && (
        <DisplayTechnicalInfo technical={technical} />
      )}
    </div>
  </SimpleTile>
);
