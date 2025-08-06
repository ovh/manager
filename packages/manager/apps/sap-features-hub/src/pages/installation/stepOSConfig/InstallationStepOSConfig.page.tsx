import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsInputChangeEvent,
  OdsToggleChangeEvent,
} from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
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
import { TRACKING } from '@/tracking.constants';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { mapFormOSConfigToStructured } from '@/mappers/stepFormMappers';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

export default function InstallationStepOSConfig() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();
  const {
    values: { serviceName, ...formValues },
    errors: formErrors,
    setValues,
    setErrors,
  } = useInstallationFormContext();
  const { trackClick } = useOvhTracking();

  const { values, errors } = getOSConfigFormData({
    values: { serviceName, ...formValues },
    errors: formErrors,
  });

  const isStepValid =
    !!values.domainName && !errors.domainName && !errors.osLicense;

  const handleValueChange = (e: OdsToggleChangeEvent | OdsInputChangeEvent) => {
    const { name, value } = e.detail;
    if (name === 'osLicense') {
      setValues((prev) => ({
        ...prev,
        osLicense: value as string,
        osUpdate: value ? prev.osUpdate : false,
      }));
      return;
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = ({ e, error, isValid }: HandleInputChangeProps) => {
    handleValueChange(e);
    clearServerErrorMessage();
    if (error) {
      setErrors((err) => ({ ...err, [e.detail.name]: isValid ? '' : error }));
    }
  };

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation({
    mapper: mapFormOSConfigToStructured,
    serviceName,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      setServerErrorMessage(error.response.data.message);
    },
  });

  return (
    <FormLayout
      title={t('os_config_title')}
      subtitle={t('os_config_subtitle')}
      submitLabel={t('os_config_cta')}
      isSubmitDisabled={!isStepValid || !!serverErrorMessage}
      isSubmitLoading={isValidationPending}
      serverErrorMessage={serverErrorMessage}
      onSubmit={() => {
        trackClick(TRACKING.installation.virtualMachines);
        validate(values);
      }}
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
        isDisabled={!values.osLicense}
        tooltip={!values.osLicense && t('os_config_tooltip_update')}
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
