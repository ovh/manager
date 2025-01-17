import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { FormTitle } from '@/components/Form/FormTitle.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  FORM_SAP_SIDS_LABEL,
  SYSTEM_PASSWORD_INPUTS,
  SYSTEM_TEXT_INPUTS,
} from './installationStepSystemInformation.constants';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import { getSystemFormData } from '@/utils/formStep';
import { isValidSapPassword } from '@/utils/formValidation';

export default function InstallationStepSystemInformation() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: formValues,
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();

  const values = getSystemFormData(formValues);
  const errors = getSystemFormData(formErrors);

  const isFormValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      !Object.values(errors).some((error) => !!error),
    [values, errors],
  );

  const sidRule = t('system_sid_validation_message');
  const pwdRule = t('system_password_validation_message');

  return (
    <div>
      <FormTitle title={t('system_title')} subtitle={t('system_subtitle')} />
      <form className="flex flex-col gap-y-6">
        <OdsText preset="heading-3">{FORM_SAP_SIDS_LABEL}</OdsText>
        <OdsText>{sidRule}</OdsText>
        {SYSTEM_TEXT_INPUTS.map(({ name, helperKey, ...inputProps }) => (
          <TextField
            key={name}
            name={name}
            onOdsChange={(e) => {
              const isValid = e.detail.validity?.valid;
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
        <OdsText>{pwdRule}</OdsText>
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
        <div className="flex gap-x-2">
          <OdsButton
            label={t('previous_step_cta')}
            variant="outline"
            onClick={previousStep}
          />
          <OdsButton
            label={t('system_cta')}
            isDisabled={!isFormValid}
            onClick={nextStep}
          />
        </div>
      </form>
    </div>
  );
}
