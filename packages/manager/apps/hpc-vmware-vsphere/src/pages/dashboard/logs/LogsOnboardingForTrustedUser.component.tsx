import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { TRACKING } from '@/tracking.constant';

const LogsOnboardingForTrustedUser = () => {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils(LANDING_URL);
  const { trackClick } = useOvhTracking();

  return (
    <>
      <OdsText preset="heading-6">
        {t('logs_introduction_title_syslog')}
      </OdsText>
      <OdsText preset="paragraph">
        {t('logs_introduction_description_syslog')}
      </OdsText>{' '}
      <Links
        type={LinkType.external}
        label={t('logs_introduction_description_link')}
        href={guides?.logs_data_platform} // PLACEHOLDER WAITING FOR REAL GUIDES
        target="_blank"
        rel="noopener noreferrer"
        onClickReturn={() =>
          trackClick(TRACKING.logsOnboarding.goToSeeMoreLogs)
        }
      />
    </>
  );
};

export default LogsOnboardingForTrustedUser;
