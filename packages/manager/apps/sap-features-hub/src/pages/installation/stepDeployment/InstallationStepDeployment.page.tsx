import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { FormTitle } from '@/components/Form/FormTitle.component';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import {
  APPLICATION_TYPES,
  APPLICATION_VERSIONS,
  DEPLOYMENT_TYPES,
} from './installationStepDeployment.constants';
import { useLocalStorage } from '@/hooks/localStorage/useLocalStorage';

export default function InstallationStepDeployment() {
  const { t } = useTranslation('installation');
  const [applicationVersion, setApplicationVersion] = useState<string>(null);
  const [applicationType, setApplicationType] = useState<string>(null);
  const [deploymentType, setDeploymentType] = useState<string>(null);
  const { previousStep, nextStep, currentStepLabel } = useFormSteps();
  const { setStorageItem, removeStorageItem } = useLocalStorage();

  const isFormValid = applicationVersion && applicationType && deploymentType;

  const handlePrevious = () => {
    removeStorageItem(currentStepLabel);
    previousStep();
  };
  const handleSubmit = () => {
    setStorageItem(currentStepLabel, {
      applicationVersion,
      applicationType,
      deploymentType,
    });
    nextStep();
  };

  return (
    <div>
      <FormTitle
        title={t('deployment_title')}
        subtitle={t('deployment_subtitle')}
      />
      <form className="flex flex-col gap-y-6">
        <SelectField
          name={'deployment_application_version'}
          label={t('deployment_input_application_version')}
          placeholder={t('select_label')}
          options={APPLICATION_VERSIONS}
          handleChange={(event) => setApplicationVersion(event.detail.value)}
        />
        <SelectField
          name={'deployment_application_type'}
          label={t('deployment_input_application_type')}
          placeholder={t('select_label')}
          options={APPLICATION_TYPES}
          handleChange={(event) => setApplicationType(event.detail.value)}
        />
        <SelectField
          name={'deployment_type'}
          label={t('deployment_input_deployment_type')}
          placeholder={t('select_label')}
          options={DEPLOYMENT_TYPES}
          handleChange={(event) => setDeploymentType(event.detail.value)}
        />
        <div className="flex gap-x-2">
          <OdsButton
            label={t('previous_step_cta')}
            variant="outline"
            onClick={handlePrevious}
          />
          <OdsButton
            label={t('deployment_cta')}
            isDisabled={!isFormValid}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
