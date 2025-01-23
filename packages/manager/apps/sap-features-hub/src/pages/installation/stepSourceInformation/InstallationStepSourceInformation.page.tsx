import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { isValidInput, isValidUrl } from '@/utils/formValidation';
import FormLayout from '@/components/Form/FormLayout.component';
import { HandleInputChangeProps } from '@/types/formChange.type';

export default function InstallationStepSourceInformation() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: formValues,
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();

  const { values, errors } = getSourceFormData({
    values: formValues,
    errors: formErrors,
  });

  const isStepValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      !Object.values(errors).some((error) => !!error),
    [values, errors],
  );

  const handleChange = ({ e, error, isValid }: HandleInputChangeProps) => {
    const { name, value } = e.detail;
    setValues((val) => ({ ...val, [name]: value }));
    if (error) {
      setErrors((err) => ({ ...err, [name]: isValid ? '' : error }));
    }
  };

  return (
    <FormLayout
      title={t('source_title')}
      subtitle={t('source_subtitle')}
      submitLabel={t('source_cta')}
      isSubmitDisabled={!isStepValid}
      onSubmit={nextStep}
      onPrevious={previousStep}
    >
      <TextField
        key="bucketId"
        name="bucketId"
        label={t('source_input_container')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('source_helper_container'),
            isValid: isValidInput(e),
          });
        }}
        value={values.bucketId}
        error={values.bucketId && errors.bucketId}
        placeholder="my-sap-sources"
        helperText={t('source_helper_container')}
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
            error: t('source_helper_endpoint'),
            isValid: isValidUrl(e.detail.value as string),
          });
        }}
        value={values.endpoint}
        error={values.endpoint && errors.endpoint}
        helperText={t('source_helper_endpoint')}
      />
      <TextField
        key="accessKey"
        name="accessKey"
        label={t('source_input_access_key')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('source_helper_access_key'),
            isValid: isValidInput(e),
          });
        }}
        value={values.accessKey}
        error={values.accessKey && errors.accessKey}
        helperText={t('source_helper_access_key')}
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
        label={t('source_input_secret_key')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('source_helper_secret_key'),
            isValid: isValidInput(e),
          });
        }}
        value={values.secretKey}
        error={values.secretKey && errors.secretKey}
        helperText={t('source_helper_secret_key')}
        validator={{
          pattern: SAP_SOURCE_PATTERNS.key,
          minlength: SOURCE_KEY_LENGTH,
          maxlength: SOURCE_KEY_LENGTH,
        }}
      />
    </FormLayout>
  );
}
