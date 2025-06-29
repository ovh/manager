import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import {
  SAP_SOURCE_PATTERNS,
  SOURCE_BUCKET_MAX_LENGTH,
  SOURCE_BUCKET_MIN_LENGTH,
  SOURCE_KEY_LENGTH,
} from './installationStepSourceInformation.constants';
import { getSourceFormData } from '@/utils/formStepData';
import { isValidInput } from '@/utils/formValidation';
import FormLayout from '@/components/Form/FormLayout.component';
import { HandleInputChangeProps } from '@/types/formChange.type';
import { TRACKING } from '@/tracking.constants';
import { ENDPOINT_REGEX } from '@/constants/form.constants';
import { SourceForm } from '@/types/form.type';
import { mapFormSourceInformationToStructured } from '@/mappers/stepFormMappers';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

export default function InstallationStepSourceInformation() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: { serviceName, ...formValues },
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();
  const { trackClick } = useOvhTracking();
  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  const { values, errors } = getSourceFormData({
    values: { serviceName, ...formValues },
    errors: formErrors,
  });

  const isStepValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      !Object.values(errors).some((error) => !!error),
    [values, errors],
  );

  const handleChange = ({ e, error, isValid }: HandleInputChangeProps) => {
    clearServerErrorMessage();
    const { name, value } = e.detail;
    setValues((val) => ({ ...val, [name]: value }));
    if (error) {
      setErrors((err) => ({ ...err, [name]: isValid ? '' : error }));
    }
  };

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation<SourceForm>({
    mapper: mapFormSourceInformationToStructured,
    serviceName,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      setServerErrorMessage(error.response?.data?.message);
    },
  });

  return (
    <FormLayout
      title={t('source_title')}
      subtitle={t('source_subtitle')}
      submitLabel={t('source_cta')}
      isSubmitDisabled={
        !isStepValid || !!serverErrorMessage || isValidationPending
      }
      serverErrorMessage={serverErrorMessage}
      onSubmit={() => {
        trackClick(TRACKING.installation.defineOsConfig);
        validate(values);
      }}
      onPrevious={previousStep}
    >
      <TextField
        key="bucketId"
        name="bucketId"
        label={t('common_input_container')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('common_helper_container'),
            isValid: isValidInput(e),
          });
        }}
        value={values.bucketId}
        error={values.bucketId && errors.bucketId}
        placeholder="my-sap-sources"
        helperText={t('common_helper_container')}
        validator={{
          pattern: SAP_SOURCE_PATTERNS.bucket,
          minlength: SOURCE_BUCKET_MIN_LENGTH,
          maxlength: SOURCE_BUCKET_MAX_LENGTH,
        }}
      />
      <TextField
        key="endpoint"
        name="endpoint"
        label="Endpoint"
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('common_helper_endpoint'),
            isValid: isValidInput(e),
          });
        }}
        value={values.endpoint}
        error={values.endpoint && errors.endpoint}
        helperText={t('common_helper_endpoint')}
        validator={{ pattern: ENDPOINT_REGEX.source }}
      />
      <TextField
        key="accessKey"
        name="accessKey"
        label={t('common_input_access_key')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('common_helper_access_key'),
            isValid: isValidInput(e),
          });
        }}
        value={values.accessKey}
        error={values.accessKey && errors.accessKey}
        helperText={t('common_helper_access_key')}
        validator={{
          pattern: SAP_SOURCE_PATTERNS.key,
          minlength: SOURCE_KEY_LENGTH,
          maxlength: SOURCE_KEY_LENGTH,
        }}
      />
      <TextField
        key="secretKey"
        name="secretKey"
        type="password"
        label={t('common_input_secret_key')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('common_helper_secret_key'),
            isValid: isValidInput(e),
          });
        }}
        value={values.secretKey}
        error={values.secretKey && errors.secretKey}
        helperText={t('common_helper_secret_key')}
        validator={{
          pattern: SAP_SOURCE_PATTERNS.key,
          minlength: SOURCE_KEY_LENGTH,
          maxlength: SOURCE_KEY_LENGTH,
        }}
      />
    </FormLayout>
  );
}
