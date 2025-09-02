import {
  Links,
  LinkType,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsSpinner } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { TRACKING } from '@/tracking.constant';

const LogsActivationInProgress = () => {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils(LANDING_URL);
  const { trackPage, trackClick } = useOvhTracking();

  useEffect(() => {
    trackPage({
      pageType: PageType.onboarding,
      pageName: 'logs-activation-in-progress',
    });
  }, []);

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
              onClickReturn={() =>
                trackClick(TRACKING.logsOnboarding.goToSeeMoreLogs)
              }
            />
          </div>
        </>
      }
    />
  );
};

export default LogsActivationInProgress;
