import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import {
  SAP_SOURCE_PATTERNS,
  SOURCE_BUCKET_MAX_LENGTH,
  SOURCE_BUCKET_MIN_LENGTH,
  SOURCE_KEY_LENGTH,
} from './installationStepSourceInformation.constants';
import { getSourceFormData } from '@/utils/formStep';
import { isValidUrl } from '@/utils/formValidation';
import FormLayout from '@/components/Form/FormLayout.component';

export default function InstallationStepSourceInformation() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: formValues,
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();

  const values = getSourceFormData(formValues);
  const errors = getSourceFormData(formErrors);

  const isStepValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      !Object.values(errors).some((error) => !!error),
    [values, errors],
  );

  const handleChange = (e: OdsInputChangeEvent) => {
    const { name, value } = e.detail;
    const isValid = e.detail.validity?.valid;
    setValues((val) => ({ ...val, [name]: value }));
    setErrors((err) => ({ ...err, [name]: isValid ? '' : t('invalid_input') }));
  };

  return (
    <FormLayout
      title={t('source_title')}
      subtitle={t('source_subtitle')}
      submitLabel={t('source_cta')}
      isSubmitDisabled={!isStepValid}
      onClickSubmit={nextStep}
      onClickPrevious={previousStep}
    >
      <TextField
        key="bucketId"
        name="bucketId"
        label={t('source_input_container')}
        onOdsChange={handleChange}
        pattern={SAP_SOURCE_PATTERNS.bucket}
        value={values.bucketId}
        error={values.bucketId && errors.bucketId}
        placeholder="my-sap-sources"
        helperText={t('source_helper_container')}
        minlength={SOURCE_BUCKET_MIN_LENGTH}
        maxlength={SOURCE_BUCKET_MAX_LENGTH}
      />
      <TextField
        key="endpoint"
        name="endpoint"
        label="Endpoint"
        onOdsChange={(e) => {
          const { name, value } = e.detail;
          const isValid = isValidUrl(value as string);
          setValues((val) => ({ ...val, [name]: value }));
          setErrors((err) => ({
            ...err,
            [name]: isValid ? '' : t('invalid_input'),
          }));
        }}
        value={values.endpoint}
        error={values.endpoint && errors.endpoint}
        helperText={t('source_helper_endpoint')}
      />
      <TextField
        key="accessKey"
        name="accessKey"
        label={t('source_input_access_key')}
        onOdsChange={handleChange}
        pattern={SAP_SOURCE_PATTERNS.key}
        value={values.accessKey}
        error={values.accessKey && errors.accessKey}
        helperText={t('source_helper_access_key')}
        minlength={SOURCE_KEY_LENGTH}
        maxlength={SOURCE_KEY_LENGTH}
      />
      <TextField
        key="secretKey"
        name="secretKey"
        label={t('source_input_secret_key')}
        onOdsChange={handleChange}
        pattern={SAP_SOURCE_PATTERNS.key}
        value={values.secretKey}
        error={values.secretKey && errors.secretKey}
        helperText={t('source_helper_secret_key')}
        minlength={SOURCE_KEY_LENGTH}
        maxlength={SOURCE_KEY_LENGTH}
      />
    </FormLayout>
  );
}
