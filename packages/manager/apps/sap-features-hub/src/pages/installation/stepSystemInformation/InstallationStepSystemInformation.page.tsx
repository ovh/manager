import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { FormTitle } from '@/components/Form/FormTitle.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  FORM_SAP_SIDS_LABEL,
  SYSTEM_PASSWORD_INPUTS,
  SYSTEM_TEXT_INPUTS,
} from './installationStepSystemInformation.constants';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import { SystemForm } from '@/types/form.type';

export default function InstallationStepSystemInformation() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: formValues,
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();

  const values: SystemForm = {
    sapSid: formValues.sapSid,
    sapHanaSid: formValues.sapHanaSid,
    masterSapPassword: formValues.masterSapPassword,
    masterSapHanaPassword: formValues.masterSapHanaPassword,
    sidamnPassword: formValues.sidamnPassword,
    systemPassword: formValues.systemPassword,
  };
  const errors: SystemForm = {
    sapSid: formErrors.sapSid,
    sapHanaSid: formErrors.sapHanaSid,
    masterSapPassword: formErrors.masterSapPassword,
    masterSapHanaPassword: formErrors.masterSapHanaPassword,
    sidamnPassword: formErrors.sidamnPassword,
    systemPassword: formErrors.systemPassword,
  };

  const isFormValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      Object.values(errors).every((error) => !error),
    [values, errors],
  );

  const handleChange = (e: OdsInputChangeEvent) => {
    const { name, value } = e.detail;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !e.detail.validity?.valid }));
  };

  return (
    <div>
      <FormTitle title={t('system_title')} subtitle={t('system_subtitle')} />
      <form className="flex flex-col gap-y-6">
        <OdsText preset="heading-3">{FORM_SAP_SIDS_LABEL}</OdsText>
        <OdsText>{t('system_sid_validation_message')}</OdsText>
        {SYSTEM_TEXT_INPUTS.map((input) => (
          <TextField
            key={input.name}
            name={input.name}
            value={values[input.name]}
            onOdsChange={handleChange}
            label={input.label}
            placeholder={input.placeholder}
            pattern={input.pattern}
            error={
              !!values[input.name] && errors[input.name]
                ? t('system_sid_validation_message')
                : undefined
            }
            helperText={t(input.helperKey)}
            minlength={input.minlength || undefined}
            maxlength={input.maxlength || undefined}
          />
        ))}
        <OdsText preset="heading-3">{t('passwords')}</OdsText>
        <OdsText>{t('system_password_validation_message')}</OdsText>
        {SYSTEM_PASSWORD_INPUTS.map((input) => (
          <TextField
            key={input.name}
            type="password"
            name={input.name}
            value={values[input.name]}
            onOdsChange={handleChange}
            label={input.label}
            placeholder={input.placeholder}
            pattern={input.pattern}
            error={
              !!values[input.name] && errors[input.name]
                ? t('system_password_validation_message')
                : undefined
            }
            helperText={t(input.helperKey)}
            minlength={input.minlength || undefined}
            maxlength={input.maxlength || undefined}
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
