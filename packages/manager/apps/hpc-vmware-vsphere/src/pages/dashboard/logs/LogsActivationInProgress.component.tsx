import {
  Links,
  LinkType,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsSpinner } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

const LogsActivationInProgress = () => {
  const { t } = useTranslation('onboarding');

  return (
    <OnboardingLayout
      title={t('logs_onboarding_activation_title')}
      description={
        <>
          <OdsSpinner />
          <OdsText preset="caption">
            {t('logs_onboarding_activation_caption')}
          </OdsText>
          <OdsText preset="paragraph" className="text-center">
            {t('logs_onboarding_activation_description')}
          </OdsText>
          <div className="flex flex-row gap-4 justify-center">
            <Links
              type={LinkType.external}
              label={t('logs_onboarding_secondary_cta')}
              target="_blank"
              href="https://www.ovhcloud.com/fr/identity-security-operations/logs-data-platform/"
            />
          </div>
        </>
      }
    />
  );
};

export default LogsActivationInProgress;
