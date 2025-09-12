import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  FormProvider,
  useForm,
  FieldPath,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
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
import { DEPLOYMENT_FORM_SCHEMA } from '@/schema/deployment.schema';
import { RhfSelectField } from '@/components/Fields/RhfSelectField.component';
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
    initializationState: { isPrefilled, prefilledData },
    setValues,
  } = useInstallationFormContext();

  const {
    data: sapCapabilities,
    isLoading: isLoadingSapCapabilities,
    isError: isSapCapabilitiesError,
  } = useSapCapabilities(serviceName);

  const dataForm = { applicationVersion, applicationType, deploymentType };
  const getLatestValue = (input: keyof DeploymentForm) =>
    getSelectLatestValue({
      isPrefilled,
      value: dataForm[input],
      prefilledValue: prefilledData[input],
    });

  const defaultValues: DeploymentForm = {
    applicationVersion: getSelectDefaultValue(
      getLatestValue('applicationVersion'),
      sapCapabilities?.applicationVersions,
    ),
    applicationType: getSelectDefaultValue(
      getLatestValue('applicationType'),
      sapCapabilities?.applicationTypes,
    ),
    deploymentType: getSelectDefaultValue(
      getLatestValue('deploymentType'),
      sapCapabilities?.deploymentTypes,
    ) as DeploymentType,
  };

  const methods = useForm<DeploymentForm>({
    mode: 'onTouched',
    resolver: zodResolver(DEPLOYMENT_FORM_SCHEMA),
    defaultValues,
  });

  const { control, getValues, formState, reset } = methods;

  const saveFormOnContext = () => {
    const formData = getValues();

    setValues((prev) => ({
      ...prev,
      applicationVersion: formData.applicationVersion,
      applicationType: formData.applicationType,
      deploymentType: formData.deploymentType,
    }));
  };

  useEffect(() => {
    return saveFormOnContext;
  }, []);

  useEffect(() => {
    if (!isLoadingSapCapabilities) reset(defaultValues);
  }, [isLoadingSapCapabilities]);

  const { trackClick } = useOvhTracking();

  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  const fieldWithHandler = <
    TFormData extends FieldValues,
    TFieldName extends FieldPath<TFormData>
  >(
    field: ControllerRenderProps<TFormData, TFieldName>,
  ) => ({
    ...field,
    onChange: (...params: unknown[]) => {
      field.onChange(...params);
      clearServerErrorMessage();
    },
  });

  const fieldDeploymentTypeWithHandler = <
    TFormData extends FieldValues,
    TFieldName extends FieldPath<TFormData>
  >(
    field: ControllerRenderProps<TFormData, TFieldName>,
  ) => ({
    ...field,
    onChange: (...params: unknown[]) => {
      const newValue = params[0] as DeploymentType;
      if (newValue) {
        const hasChangedPrefilledValue =
          isPrefilled && prefilledData.deploymentType !== newValue;

        if (!isPrefilled || hasChangedPrefilledValue) {
          field.onChange(...params);
          clearServerErrorMessage();
          setValues((prev) => ({
            ...prev,
            applicationServers: null,
          }));
        }
      }
    },
  });

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
    <FormProvider {...methods}>
      <InstallationFormLayout
        title={t('deployment_title')}
        subtitle={t('deployment_subtitle')}
        submitLabel={t('deployment_cta')}
        isSubmitDisabled={!formState.isValid || !!serverErrorMessage}
        isSubmitLoading={isValidationPending}
        serverErrorMessage={serverErrorMessage}
        onSubmit={() => {
          trackClick(TRACKING.installation.completeInformations);
          validate(getValues());
        }}
        onPrevious={previousStep}
      >
        <Controller
          name="applicationVersion"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={t('deployment_input_application_version')}
              placeholder={t('select_label')}
              options={sapCapabilities?.applicationVersions}
              isLoading={isLoadingSapCapabilities}
              isDisabled={isLoadingSapCapabilities || isSapCapabilitiesError}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="applicationType"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldWithHandler(field)}
              label={t('deployment_input_application_type')}
              placeholder={t('select_label')}
              options={sapCapabilities?.applicationTypes}
              isLoading={isLoadingSapCapabilities}
              isDisabled={isLoadingSapCapabilities || isSapCapabilitiesError}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="deploymentType"
          control={control}
          render={({ field, fieldState }) => (
            <RhfSelectField
              field={fieldDeploymentTypeWithHandler(field)}
              label={t('deployment_input_deployment_type')}
              placeholder={t('select_label')}
              options={sapCapabilities?.deploymentTypes}
              isLoading={isLoadingSapCapabilities}
              isDisabled={isLoadingSapCapabilities || isSapCapabilitiesError}
              error={fieldState.error?.message}
            />
          )}
        />
      </InstallationFormLayout>
    </FormProvider>
  );
}
