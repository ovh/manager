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
  OsdsRadio,
  OsdsRadioGroup,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
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
  onClick: () => void;
  isDisabled: boolean;
}> = ({ name, isActive, description, chipLabel, onClick, isDisabled }) => (
  <OsdsTile
    aria-label={`tile-${name}`}
    disabled={isDisabled || undefined}
    checked={isActive || undefined}
    color={
      isActive ? ODS_THEME_COLOR_INTENT.text : ODS_THEME_COLOR_INTENT.default
    }
    className="w-1/2 mr-5"
    onClick={() => {
      if (!isDisabled) {
        onClick();
      }
    }}
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
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const isValidName = rancherName !== '' && isValidRancherName(rancherName);
  const hasInputError = rancherName !== null && !isValidName;

  useEffect(() => {
    if (selectedPlan === null && plans?.length) {
      setSelectedPlan(plans?.filter((v) => v.status === 'AVAILABLE')[0]);
    }

    if (selectedVersion === null && versions?.length) {
      setSelectedVersion(versions?.filter((v) => v.status === 'AVAILABLE')[0]);
    }
  }, [versions, plans]);

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
            placeholder={t('createRancherPlaceholder')}
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
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('createRancherServiceLevelDescription')}
        </OsdsText>
        <div className="flex my-5">
          {plans?.map((plan) => (
            <TileSection
              key={plan.name}
              isActive={plan.name === selectedPlan?.name}
              isDisabled={plan.status !== 'AVAILABLE'}
              name={t(plan.name)}
              description={t(getRancherPlanDescription(plan.name))}
              chipLabel={
                plan.name === 'OVHCLOUD_EDITION' ? t('comingSoon') : ''
              }
              onClick={() => setSelectedPlan(plan)}
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
          {versions?.map((version) => (
            <TileSection
              key={version.name}
              isActive={version.name === selectedVersion?.name}
              name={version.name}
              description={
                version.name === selectedVersion?.name
                  ? t('createRancherRecomendedVersion')
                  : undefined
              }
              isDisabled={version.status !== 'AVAILABLE'}
              onClick={() => setSelectedVersion(version)}
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
                  version: selectedVersion.name,
                  plan: selectedPlan.name,
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
