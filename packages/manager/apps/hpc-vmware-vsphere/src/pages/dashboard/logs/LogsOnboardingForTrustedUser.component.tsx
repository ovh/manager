import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

const LogsOnboardingForTrustedUser = () => {
  const { t } = useTranslation('onboarding');
  const guides = useGuideUtils(LANDING_URL);
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
      />
    </>
  );
};

export default LogsOnboardingForTrustedUser;
