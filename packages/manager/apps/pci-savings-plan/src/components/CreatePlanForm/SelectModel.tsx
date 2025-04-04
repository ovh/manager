import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import React from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsTabs, OdsTab, OdsSpinner } from '@ovhcloud/ods-components/react';
import { DescriptionWrapper } from './CreatePlanForm';
import { TileTechnicalInfo } from '../TileTechnicalInfo/TileTechnicalInfo';
import { Block } from '../SimpleTile/SimpleTile';
import { InstanceInfo, TechnicalInfo } from '@/types/CreatePlan.type';

type SelectModelProps = {
  technicalInfo: TechnicalInfo[];
  instanceCategory: string;
  isInstance: boolean;
  isTechnicalInfoLoading: boolean;
  onSelectModel: (model: string) => void;
  setInstanceCategory: (category: string) => void;
  tabsList: InstanceInfo[];
  technicalModel: string;
};

const SelectModel = ({
  technicalInfo,
  instanceCategory,
  isInstance,
  isTechnicalInfoLoading,
  onSelectModel,
  setInstanceCategory,
  tabsList,
  technicalModel,
}: SelectModelProps) => {
  const { t } = useTranslation('create');

  return (
    <Block>
      <Subtitle>{t('select_model')}</Subtitle>
      {isInstance && (
        <div className="mb-[16px] mt-[12px]">
          <OdsTabs slot="top">
            {tabsList.map(({ technicalName, label }) => (
              <OdsTab
                key={technicalName}
                isSelected={technicalName === instanceCategory}
                onClick={() => setInstanceCategory(technicalName)}
              >
                {label}
              </OdsTab>
            ))}
          </OdsTabs>
        </div>
      )}
      <DescriptionWrapper>
        {t(`select_model_description_instance_${instanceCategory}`)}
      </DescriptionWrapper>
      {!isTechnicalInfoLoading ? (
        <div className="flex flex-row w-full overflow-x-auto mb-[32px] gap-6">
          {technicalInfo?.map(({ name, technical }) => (
            <TileTechnicalInfo
              key={name}
              technical={technical}
              name={name}
              onClick={() => onSelectModel(name)}
              isActive={technicalModel === name}
            />
          ))}
        </div>
      ) : (
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      )}
    </Block>
  );
};

export default SelectModel;
