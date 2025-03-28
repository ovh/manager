import { Subtitle } from '@ovh-ux/manager-react-components';
import clsx from 'clsx';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { DescriptionWrapper } from './CreatePlanForm';
import SimpleTile, { Block } from '../SimpleTile/SimpleTile';
import { DeploymentMode, getDeploymentOptions } from '@/utils/savingsPlan';

import './select-deployment.css';

type SelectDeploymentProps = {
  setDeploymentMode: (deploymentMode: DeploymentMode) => void;
  deploymentMode: DeploymentMode;
};

const SelectDeployment = ({
  setDeploymentMode,
  deploymentMode,
}: SelectDeploymentProps) => {
  const { t } = useTranslation(['create', 'listing']);

  return (
    <Block>
      <Subtitle className="flex items-center gap-2">
        {t('choose_deployment')}
        <OdsBadge label="Nouveau" color="new" className="ml-2" />
      </Subtitle>
      <DescriptionWrapper>
        {t('choose_deployment_description')}
      </DescriptionWrapper>

      <div className="flex flex-row w-full overflow-x-auto mb-[32px] gap-6">
        {getDeploymentOptions(t).map((option) => (
          <SimpleTile
            onClick={() => {
              setDeploymentMode(option.name);
            }}
            isActive={deploymentMode === option.name}
            key={option.name}
            className="w-1/2"
          >
            <div className="flex flex-col gap-4 h-full">
              <OdsText>
                <span className="font-bold">
                  {t('region')} {option.name}
                </span>
              </OdsText>
              <OdsBadge
                label={option.name}
                className={clsx(
                  option.name === DeploymentMode['3AZ']
                    ? 'chip-3AZ'
                    : 'chip-1AZ',
                )}
              />
              <OdsText className="text-sm ">{option.description}</OdsText>
            </div>
          </SimpleTile>
        ))}
      </div>
    </Block>
  );
};

export default SelectDeployment;
