import {
  Links,
  LinkType,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsSpinner } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

const LogsActivationInProgress = () => {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils(LANDING_URL);

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
              href={guides.logs_data_platform}
            />
          </div>
        </>
      }
    />
  );
};

export default LogsActivationInProgress;
