import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsInput,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isValidRancherName } from '@/utils/rancher';
import Title, { Subtitle } from '@/components/Title/Title';
import Block from '@/components/Block/Block';
import {
  CreateRancherPayload,
  RancherPlan,
  RancherVersion,
} from '@/api/api.type';

const TileSection: React.FC<{
  name: string;
  isActive: boolean;
  description?: string;
  chipLabel?: string;
}> = ({ name, isActive, description, chipLabel }) => (
  <OsdsTile
    aria-label={`tile-${name}`}
    disabled={!isActive || undefined}
    checked={isActive || undefined}
    color={
      isActive ? ODS_THEME_COLOR_INTENT.text : ODS_THEME_COLOR_INTENT.default
    }
    className="w-1/2 mr-5 "
  >
    <div className="flex flex-col">
      <div className="flex items-center">
        <OsdsText
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {name}
        </OsdsText>
        {chipLabel ? (
          <OsdsChip color={ODS_THEME_COLOR_INTENT.primary} className="ml-5">
            {chipLabel}
          </OsdsChip>
        ) : (
          <></>
        )}
      </div>
      <Block>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{description}</OsdsText>
      </Block>
    </div>
  </OsdsTile>
);

const getRancherPlanDescription = (rancherPlan: RancherPlan['name']) => {
  switch (rancherPlan) {
    case 'STANDARD':
      return 'createRancherStandardPlanDescription';
    case 'OVHCLOUD_EDITION':
      return 'createRancherOVHCloudPlanDescription';
    default:
      return '';
  }
};

export interface CreateRancherProps {
  projectId: string;
  plans: RancherPlan[];
  versions: RancherVersion[];
  hasRancherCreationError: boolean;
  onCreateRancher: (payload: CreateRancherPayload) => void;
}

const CreateRancher: React.FC<CreateRancherProps> = ({
  plans,
  versions,
  onCreateRancher,
  hasRancherCreationError,
  projectId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'pci-rancher/dashboard',
    'pci-rancher/listing',
  ]);
  const [rancherName, setRancherName] = useState(null);

  const activeVersion = versions?.filter((v) => v.status === 'AVAILABLE')[0];
  const activePlan = plans?.filter((v) => v.status === 'AVAILABLE')[0];
  const isValidName = rancherName !== '' && isValidRancherName(rancherName);
  const hasInputError = rancherName !== null && !isValidName;

  const onCreateClick = (rancherPayload: CreateRancherPayload) => {
    onCreateRancher(rancherPayload);
    navigate(`/pci/projects/${projectId}/rancher`);
  };

  const onCancelClick = () =>
    navigate(`/pci/projects/${projectId}/rancher/onboarding`);

  return (
    <div className="max-w-3xl">
      <Title>{t('createRancherTitle')}</Title>
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.info}
        type={ODS_MESSAGE_TYPE.info}
        className="my-6"
      >
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('createRancherInfoMessage')} <br />
        </OsdsText>
      </OsdsMessage>
      {hasRancherCreationError && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
          className="my-6"
        >
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('createRancherError')} <br />
          </OsdsText>
        </OsdsMessage>
      )}
      <div>
        <div className="mb-8">
          <Block>
            <Subtitle>{t('createRancherName')}</Subtitle>
          </Block>
          <Block>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
              {t('createRancherDescription')}
            </OsdsText>
          </Block>
          <OsdsInput
            aria-label="rancher-name-input"
            type={ODS_INPUT_TYPE.text}
            color={
              hasInputError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.info
            }
            className="my-3 w-1/3"
            value={rancherName}
            onOdsValueChange={(
              e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
            ) => setRancherName(e.target.value as string)}
          />
        </div>

        <div className="my-3">
          <Subtitle>{t('createRancherServiceLevel')}</Subtitle>
        </div>
        <Block>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('createRancherServiceLevelTitle')}
          </OsdsText>
        </Block>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('createRancherServiceLevelDescription')}
        </OsdsText>
        <div className="flex my-5">
          {plans?.map((v) => (
            <TileSection
              isActive={v.name === activePlan?.name}
              name={t(v.name)}
              description={t(getRancherPlanDescription(v.name))}
              chipLabel={v.name === 'OVHCLOUD_EDITION' ? t('comingSoon') : ''}
            />
          ))}
        </div>

        <Block>
          <Subtitle>{t('createRancherVersion')}</Subtitle>
        </Block>
        <Block>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('createRancherVersionTitle')}
          </OsdsText>
        </Block>
        <Block>
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('createRancherVersionDescription')}
          </OsdsText>
        </Block>
        <div className="flex my-5">
          {versions?.map((v) => (
            <TileSection
              isActive={v.name === activeVersion?.name}
              name={v.name}
              description={
                v.name === activeVersion?.name
                  ? t('createRancherRecomendedVersion')
                  : undefined
              }
            />
          ))}
        </div>

        <div className="flex mt-8">
          <OsdsButton
            className="mr-4"
            slot="actions"
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onCancelClick}
          >
            {t('cancel')}
          </OsdsButton>
          <OsdsButton
            disabled={!isValidName || undefined}
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              if (isValidName) {
                onCreateClick({
                  name: rancherName,
                  version: activeVersion.name,
                  plan: activePlan.name,
                });
              }
            }}
          >
            {t('createRancherCTA')}
          </OsdsButton>
        </div>
      </div>
    </div>
  );
};

export default CreateRancher;
