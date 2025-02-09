import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsInputChangeEvent,
  OdsToggleChangeEvent,
} from '@ovhcloud/ods-components';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import { TextField } from '@/components/Form/TextField.component';
import { getOSConfigFormData } from '@/utils/formStepData';
import FormLayout from '@/components/Form/FormLayout.component';
import {
  OS_DOMAIN_MAX_LENGTH,
  OS_LICENCE_MAX_LENGTH,
  OS_LICENCE_MIN_LENGTH,
  OS_LICENSE_PATTERN,
} from './installationStepOSConfig.constants';
import { isValidDomain, isValidInput } from '@/utils/formValidation';
import { ToggleField } from '@/components/Form/ToggleField.component';
import { HandleInputChangeProps } from '@/types/formChange.type';

export default function InstallationStepOSConfig() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: formValues,
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();

  const { values, errors } = getOSConfigFormData({
    values: formValues,
    errors: formErrors,
  });

  const isStepValid = useMemo(
    () => values.domainName && !errors.domainName && !errors.osLicense,
    [values.domainName, errors.domainName, errors.osLicense],
  );

  const handleValueChange = (e: OdsToggleChangeEvent | OdsInputChangeEvent) => {
    setValues((val) => ({ ...val, [e.detail.name]: e.detail.value }));
  };
  const handleChange = ({ e, error, isValid }: HandleInputChangeProps) => {
    handleValueChange(e);
    if (error) {
      setErrors((err) => ({ ...err, [e.detail.name]: isValid ? '' : error }));
    }
  };

  return (
    <FormLayout
      title={t('os_config_title')}
      subtitle={t('os_config_subtitle')}
      submitLabel={t('os_config_cta')}
      isSubmitDisabled={!isStepValid}
      onSubmit={nextStep}
      onPrevious={previousStep}
    >
      <TextField
        name="domainName"
        label={t('os_config_input_domain')}
        onOdsChange={(e) => {
          handleChange({
            e,
            error: t('os_config_helper_domain'),
            isValid: isValidDomain(e.detail.value as string),
          });
        }}
        value={values.domainName}
        error={values.domainName && errors.domainName}
        placeholder="mydomain.local"
        validator={{ isRequired: true, maxlength: OS_DOMAIN_MAX_LENGTH }}
      />
      <TextField
        name="osLicense"
        label={`${t('os_config_input_suse')} (${t('optional_label')})`}
        onOdsChange={(e) => {
          const { value } = e.detail;
          handleChange({
            e,
            error: t('os_config_helper_suse'),
            isValid: value ? isValidInput(e) : true,
          });
        }}
        value={values.osLicense}
        error={values.osLicense && errors.osLicense}
        placeholder="123456789ABCDEFG"
        helperText={t('os_config_helper_suse')}
        validator={{
          pattern: OS_LICENSE_PATTERN,
          minlength: OS_LICENCE_MIN_LENGTH,
          maxlength: OS_LICENCE_MAX_LENGTH,
        }}
      />
      <ToggleField
        name={'osUpdate'}
        checked={values.osUpdate}
        onOdsChange={handleValueChange}
        label={t('os_config_toggle_update')}
      />
      <ToggleField
        name={'firewallService'}
        checked={values.firewallService}
        onOdsChange={handleValueChange}
        label={t('os_config_toggle_firewall_service')}
        tooltip={t('os_config_tooltip_firewall_service')}
      />
      <ToggleField
        name={'firewallServer'}
        checked={values.firewallServer}
        onOdsChange={handleValueChange}
        label={t('os_config_toggle_firewall_server')}
        tooltip={t('os_config_tooltip_firewall_server')}
      />
      <ToggleField
        name={'firewallDatabase'}
        checked={values.firewallDatabase}
        onOdsChange={handleValueChange}
        label={t('os_config_toggle_firewall_database')}
        tooltip={t('os_config_tooltip_firewall_database')}
      />
    </FormLayout>
  );
}
