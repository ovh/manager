import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  SYSTEM_PASSWORD_INPUTS,
  SYSTEM_TEXT_INPUTS,
} from './installationStepSystemInformation.constants';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import { getSystemFormData } from '@/utils/formStepData';
import { isValidInput, isValidSapPassword } from '@/utils/formValidation';
import FormLayout from '@/components/Form/FormLayout.component';
import { FORM_LABELS } from '@/constants/form.constants';

export default function InstallationStepSystemInformation() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: formValues,
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();

  const { values, errors } = getSystemFormData({
    values: formValues,
    errors: formErrors,
  });

  const isStepValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      !Object.values(errors).some((error) => !!error),
    [values, errors],
  );

  const sidRule = t('system_sid_validation_message');
  const pwdRule = t('system_password_validation_message');

  return (
    <FormLayout
      title={t('system_title')}
      subtitle={t('system_subtitle')}
      submitLabel={t('system_cta')}
      isSubmitDisabled={!isStepValid}
      onSubmit={nextStep}
      onPrevious={previousStep}
    >
      <OdsText preset="heading-3">{FORM_LABELS.sids}</OdsText>
      <OdsText className="italic">{sidRule}</OdsText>
      {SYSTEM_TEXT_INPUTS.map(({ name, helperKey, ...inputProps }) => (
        <TextField
          key={name}
          name={name}
          onOdsChange={(e) => {
            const isValid = isValidInput(e);
            setValues((val) => ({ ...val, [name]: e.detail.value }));
            setErrors((err) => ({ ...err, [name]: isValid ? '' : sidRule }));
          }}
          value={values[name]}
          error={values[name] && errors[name]}
          helperText={t(helperKey)}
          {...inputProps}
        />
      ))}
      <OdsText preset="heading-3">{t('passwords')}</OdsText>
      <OdsText className="italic">{pwdRule}</OdsText>
      {SYSTEM_PASSWORD_INPUTS.map(({ name, helperKey, ...inputProps }) => (
        <TextField
          key={name}
          type="password"
          name={name}
          onOdsChange={(e) => {
            const isValid = isValidSapPassword(e.detail.value as string);
            setValues((val) => ({ ...val, [name]: e.detail.value }));
            setErrors((err) => ({ ...err, [name]: isValid ? '' : pwdRule }));
          }}
          value={values[name]}
          error={values[name] && errors[name]}
          helperText={t(helperKey)}
          {...inputProps}
        />
      ))}
    </FormLayout>
  );
}
