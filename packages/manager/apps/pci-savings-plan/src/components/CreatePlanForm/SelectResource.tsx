import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Subtitle } from '@ovh-ux/manager-react-components';
import SimpleTile, { Block } from '../SimpleTile/SimpleTile';
import { Resource, ResourceType } from '@/types/CreatePlan.type';
import { DescriptionWrapper } from './CreatePlanForm';

type SelectResourceProps = {
  resources: Resource[];
  selectedResource: ResourceType;
  onChangeResource: (resource: ResourceType) => void;
  hasCreationErrorMessage?: string;
};

const SelectResource = ({
  resources,
  selectedResource,
  onChangeResource,
  hasCreationErrorMessage,
}: SelectResourceProps) => {
  const { t } = useTranslation(['create', 'listing']);

  return (
    <Block>
      {hasCreationErrorMessage && (
        <OdsMessage color="danger" className="my-4">
          <OdsText className="inline-block">{hasCreationErrorMessage}</OdsText>
        </OdsMessage>
      )}
      <Subtitle>{t('choose_ressource')}</Subtitle>
      <DescriptionWrapper>
        {t('choose_ressource_description')}
      </DescriptionWrapper>
      <div className="flex flex-row  w-full overflow-x-auto gap-6">
        {resources.map((resource) => (
          <SimpleTile
            className="py-5"
            key={resource.value.toString()}
            isActive={selectedResource === resource.value}
            onClick={() => onChangeResource(resource.value)}
          >
            <img
              className="w-16 h-16"
              src={resource.img}
              alt={resource.value}
            />
            <div>
              <OdsText>{resource.label}</OdsText>
            </div>
          </SimpleTile>
        ))}
      </div>
    </Block>
  );
};

export default SelectResource;
