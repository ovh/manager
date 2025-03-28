import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
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
      <OdsText className="mt-5">
        {t('resource_model_characteristics_gb', {
          value: memory.size,
        })}
      </OdsText>
      <OdsText>
        {t('resource_model_characteristics_cpu', {
          cores: cpu.cores,
          ghz: cpu.frequency,
        })}
      </OdsText>
      <OdsText>
        {t('resource_model_characteristics_disk', {
          value: storage.disks[0].capacity,
        })}
      </OdsText>
      <OdsText>
        {t('resource_model_characteristics_mbits', {
          value: bandwidth.level,
        })}
      </OdsText>
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
      <OdsText>
        <span className="font-bold">{name}</span>
      </OdsText>
      {technical?.bandwidth && <DisplayTechnicalInfo technical={technical} />}
    </div>
  </SimpleTile>
);
