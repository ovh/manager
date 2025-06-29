import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  SYSTEM_PASSWORD_INPUTS,
  SYSTEM_TEXT_INPUTS,
} from './installationStepSystemInformation.constants';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import { getSystemFormData } from '@/utils/formStepData';
import { isValidInput } from '@/utils/formValidation';
import {
  isValidSapPassword,
  isValidSapHanaPassword,
} from '@/utils/passwordValidation';
import FormLayout from '@/components/Form/FormLayout.component';
import { FORM_LABELS } from '@/constants/form.constants';
import { TRACKING } from '@/tracking.constants';
import { mapFormSystemInformationToStructured } from '@/mappers/stepFormMappers';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

export default function InstallationStepSystemInformation() {
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
  const { values, errors } = getSystemFormData({
    values: { serviceName, ...formValues },
    errors: formErrors,
  });

  const isStepValid = React.useMemo(
    () =>
      Object.values(values).every((value) => !!value) &&
      !Object.values(errors).some((error) => !!error),
    [values, errors],
  );

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation({
    mapper: mapFormSystemInformationToStructured,
    serviceName,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      setServerErrorMessage(error.response?.data.message);
    },
  });

  const sidRule = t('system_sid_validation_message');

  return (
    <FormLayout
      title={t('system_title')}
      subtitle={t('system_subtitle')}
      submitLabel={t('system_cta')}
      isSubmitDisabled={
        !!(!isStepValid || isValidationPending || !!serverErrorMessage)
      }
      serverErrorMessage={serverErrorMessage}
      onSubmit={() => {
        trackClick(TRACKING.installation.provideSources);
        validate(values);
      }}
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
            clearServerErrorMessage();
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
      {SYSTEM_PASSWORD_INPUTS.map(
        ({ name, helperKey, passwordType, ...inputProps }) => (
          <TextField
            key={name}
            type="password"
            name={name}
            onOdsChange={(e) => {
              const isValid =
                passwordType === 'sapHana'
                  ? isValidSapHanaPassword(e.detail.value as string)
                  : isValidSapPassword(e.detail.value as string);
              const rule =
                passwordType === 'sapHana'
                  ? t('system_password_sap_hana_validation_message')
                  : t('system_password_sap_validation_message');

              clearServerErrorMessage();
              setValues((val) => ({ ...val, [name]: e.detail.value }));
              setErrors((err) => ({ ...err, [name]: isValid ? '' : rule }));
            }}
            value={values[name]}
            error={values[name] && errors[name]}
            helperText={t(helperKey)}
            {...inputProps}
          />
        ),
      )}
    </FormLayout>
  );
}
