import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
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
import { TRACKING } from '@/tracking.constants';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { mapFormDeploymentToStructured } from '@/mappers/stepFormMappers';
import { DeploymentForm } from '@/types/form.type';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

export default function InstallationStepDeployment() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: {
      serviceName,
      applicationVersion,
      applicationType,
      deploymentType,
    },
    setValues,
    initializationState: {
      isPrefilled,
      prefilledData: { deploymentType: prefilledDeployment },
    },
  } = useInstallationFormContext();
  const { trackClick } = useOvhTracking();

  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  const handleChange = (e: OdsInputChangeEvent) => {
    const { name, value } = e.detail;
    setValues((prev) => ({ ...prev, [name]: value }));
    clearServerErrorMessage();
  };

  const isStepValid =
    !!applicationVersion && !!applicationType && !!deploymentType;

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation<DeploymentForm>({
    mapper: mapFormDeploymentToStructured,
    serviceName,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      setServerErrorMessage(error.response.data.message);
    },
  });

  return (
    <InstallationFormLayout
      title={t('deployment_title')}
      subtitle={t('deployment_subtitle')}
      submitLabel={t('deployment_cta')}
      isSubmitDisabled={
        !isStepValid || !!isValidationPending || !!serverErrorMessage
      }
      serverErrorMessage={serverErrorMessage}
      onSubmit={() => {
        trackClick(TRACKING.installation.completeInformations);
        validate({ applicationVersion, applicationType, deploymentType });
      }}
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
        handleChange={(e) => {
          const newValue = e.detail.value as DeploymentType;
          if (newValue) {
            const hasChangedPrefilledValue =
              isPrefilled && prefilledDeployment !== newValue;

            if (!isPrefilled || hasChangedPrefilledValue) {
              setValues((prev) => ({
                ...prev,
                deploymentType: newValue,
                applicationServers: null,
              }));
            }
          }
        }}
        defaultValue={deploymentType}
      />
    </InstallationFormLayout>
  );
}
