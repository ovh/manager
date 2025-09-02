import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { TRACKING } from '@/tracking.constant';

type LogsOnboardingForCommonUserProps = {
  children: React.ReactNode;
};

const LogsOnboardingForCommonUser = ({
  children,
}: LogsOnboardingForCommonUserProps) => {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils(LANDING_URL);
  const { trackClick } = useOvhTracking();

  return (
    <>
      <div className="flex flex-col mb-4">
        <OdsText preset="heading-6">{t('logs_introduction_title')}</OdsText>
        <OdsText preset="paragraph" className="mb-4">
          {t('logs_introduction_description_ldp')}
          <br />
          {t('logs_introduction_description_syslog')}
        </OdsText>
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
      </div>
      {children}
    </>
  );
};

export default LogsOnboardingForCommonUser;
