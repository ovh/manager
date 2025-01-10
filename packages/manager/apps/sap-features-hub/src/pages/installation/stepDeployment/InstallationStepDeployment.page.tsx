import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { FormTitle } from '@/components/Form/FormTitle.component';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  APPLICATION_TYPES,
  APPLICATION_VERSIONS,
  DEPLOYMENT_TYPES,
} from './installationStepDeployment.constants';
import { useInstallationFormContext } from '@/context/InstallationForm.context';

export default function InstallationStepDeployment() {
  const { t } = useTranslation('installation');
  const { previousStep, nextStep } = useFormSteps();
  const {
    values: { applicationVersion, applicationType, deploymentType },
    setValues,
  } = useInstallationFormContext();

  const isFormValid = applicationVersion && applicationType && deploymentType;

  const handleChange = (e: OdsInputChangeEvent) => {
    const { name, value } = e.detail;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <FormTitle
        title={t('deployment_title')}
        subtitle={t('deployment_subtitle')}
      />
      <form className="flex flex-col gap-y-6">
        <SelectField
          name="applicationVersion"
          label={t('deployment_input_application_version')}
          placeholder={t('select_label')}
          options={APPLICATION_VERSIONS}
          handleChange={handleChange}
          defaultValue={applicationVersion}
        />
        <SelectField
          name="applicationType"
          label={t('deployment_input_application_type')}
          placeholder={t('select_label')}
          options={APPLICATION_TYPES}
          handleChange={handleChange}
          defaultValue={applicationType}
        />
        <SelectField
          name="deploymentType"
          label={t('deployment_input_deployment_type')}
          placeholder={t('select_label')}
          options={DEPLOYMENT_TYPES}
          handleChange={handleChange}
          defaultValue={deploymentType}
        />
        <div className="flex gap-x-2">
          <OdsButton
            label={t('previous_step_cta')}
            variant="outline"
            onClick={previousStep}
          />
          <OdsButton
            label={t('deployment_cta')}
            isDisabled={!isFormValid}
            onClick={nextStep}
          />
        </div>
      </form>
    </div>
  );
}
