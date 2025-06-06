import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  APPLICATION_TYPES,
  APPLICATION_VERSIONS,
  DEPLOYMENT_TYPES,
} from './installationStepDeployment.constants';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';
import { DeploymentType } from '@/types/sapCapabilities.type';

export default function InstallationStepDeployment() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: { applicationVersion, applicationType, deploymentType },
    setValues,
    initializationState,
    setHasChangedPrefilledDeploymentType,
  } = useInstallationFormContext();

  const isStepValid = React.useMemo(
    () => applicationVersion && applicationType && deploymentType,
    [applicationVersion, applicationType, deploymentType],
  );

  const handleChange = (e: OdsInputChangeEvent) => {
    const { name, value } = e.detail;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeploymentTypeChange = (e: OdsInputChangeEvent) => {
    const newDeploymentType = e.detail.value as DeploymentType;
    const {
      isPrefilled,
      prefilledDeploymentType,
      hasChangedPrefilledDeploymentType,
    } = initializationState;

    const updateDeploymentTypeAndServers = () =>
      setValues((prev) => ({
        ...prev,
        deploymentType: newDeploymentType,
        applicationServers: null,
      }));

    if (!isPrefilled || hasChangedPrefilledDeploymentType) {
      updateDeploymentTypeAndServers();
    } else if (prefilledDeploymentType !== newDeploymentType) {
      setHasChangedPrefilledDeploymentType(true);
      updateDeploymentTypeAndServers();
    }
  };

  return (
    <InstallationFormLayout
      title={t('deployment_title')}
      subtitle={t('deployment_subtitle')}
      submitLabel={t('deployment_cta')}
      isSubmitDisabled={!isStepValid}
      onSubmit={nextStep}
      onPrevious={previousStep}
    >
      <SelectField
        name="applicationVersion"
        label={t('deployment_input_application_version')}
        placeholder={t('select_label')}
        options={APPLICATION_VERSIONS}
        handleChange={handleChange}
        defaultValue={applicationVersion}
      />
      <SelectField
        name="applicationType"
        label={t('deployment_input_application_type')}
        placeholder={t('select_label')}
        options={APPLICATION_TYPES}
        handleChange={handleChange}
        defaultValue={applicationType}
      />
      <SelectField
        name="deploymentType"
        label={t('deployment_input_deployment_type')}
        placeholder={t('select_label')}
        options={DEPLOYMENT_TYPES}
        handleChange={handleDeploymentTypeChange}
        defaultValue={deploymentType}
      />
    </InstallationFormLayout>
  );
}
