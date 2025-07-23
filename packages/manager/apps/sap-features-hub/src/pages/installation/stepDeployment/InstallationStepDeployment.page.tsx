import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';
import { DeploymentType } from '@/types/sapCapabilities.type';
import { TRACKING } from '@/tracking.constants';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { mapFormDeploymentToStructured } from '@/mappers/stepFormMappers';
import { DeploymentForm } from '@/types/form.type';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';
import { useSapCapabilities } from '@/hooks/sapCapabilities/useSapCapabilities';
import {
  getSelectDefaultValue,
  getSelectLatestValue,
} from '@/utils/selectValues';

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
    initializationState: { isPrefilled, prefilledData },
  } = useInstallationFormContext();

  const {
    data: sapCapabilities,
    isLoading: isLoadingSapCapabilities,
    isError: isSapCapabilitiesError,
  } = useSapCapabilities(serviceName);

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

  const formData = { deploymentType, applicationType, applicationVersion };
  const isStepValid = Object.values(formData).every((value) => !!value);

  const getLatestValue = (input: keyof DeploymentForm) =>
    getSelectLatestValue({
      isPrefilled,
      value: formData[input],
      prefilledValue: prefilledData[input],
    });

  return (
    <InstallationFormLayout
      title={t('deployment_title')}
      subtitle={t('deployment_subtitle')}
      submitLabel={t('deployment_cta')}
      isSubmitDisabled={!isStepValid || !!serverErrorMessage}
      isSubmitLoading={isValidationPending}
      serverErrorMessage={serverErrorMessage}
      onSubmit={() => {
        trackClick(TRACKING.installation.completeInformations);
        validate(formData);
      }}
      onPrevious={previousStep}
    >
      <SelectField
        name="applicationVersion"
        label={t('deployment_input_application_version')}
        placeholder={t('select_label')}
        options={sapCapabilities?.applicationVersions}
        isLoading={isLoadingSapCapabilities}
        isDisabled={isLoadingSapCapabilities || isSapCapabilitiesError}
        handleChange={handleChange}
        defaultValue={getSelectDefaultValue(
          getLatestValue('applicationVersion'),
          sapCapabilities?.applicationVersions,
        )}
      />
      <SelectField
        name="applicationType"
        label={t('deployment_input_application_type')}
        placeholder={t('select_label')}
        options={sapCapabilities?.applicationTypes}
        isLoading={isLoadingSapCapabilities}
        isDisabled={isLoadingSapCapabilities || isSapCapabilitiesError}
        handleChange={handleChange}
        defaultValue={getSelectDefaultValue(
          getLatestValue('applicationType'),
          sapCapabilities?.applicationTypes,
        )}
      />
      <SelectField
        name="deploymentType"
        label={t('deployment_input_deployment_type')}
        placeholder={t('select_label')}
        options={sapCapabilities?.deploymentTypes}
        isLoading={isLoadingSapCapabilities}
        isDisabled={isLoadingSapCapabilities || isSapCapabilitiesError}
        handleChange={(e) => {
          const newValue = e.detail.value as DeploymentType;
          if (newValue) {
            const hasChangedPrefilledValue =
              isPrefilled && prefilledData.deploymentType !== newValue;

            if (!isPrefilled || hasChangedPrefilledValue) {
              setValues((prev) => ({
                ...prev,
                deploymentType: newValue,
                applicationServers: null,
              }));
            }
          }
        }}
        defaultValue={getSelectDefaultValue(
          getLatestValue('deploymentType'),
          sapCapabilities?.deploymentTypes,
        )}
      />
    </InstallationFormLayout>
  );
}
