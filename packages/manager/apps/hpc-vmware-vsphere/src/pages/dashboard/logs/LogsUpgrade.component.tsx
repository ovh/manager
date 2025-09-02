import {
  Links,
  LinkType,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Region } from '@ovh-ux/manager-config';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import { getHpcVmwareVCsphereExpressOrderLink } from '@/utils/order-utils';
import { TRACKING } from '@/tracking.constant';

const LogsUpgrade = () => {
  const orderBaseUrl = useOrderURL('express_review_base');
  const { t } = useTranslation('onboarding');
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [userRegion, setUserRegion] = useState<Region>();
  const guides = useGuideUtils(LANDING_URL);
  const { trackPage, trackClick } = useOvhTracking();

  useEffect(() => {
    trackPage({
      pageName: 'logs-hds-dss',
      pageType: PageType.onboarding,
    });
  }, []);

  const getRegion = async () => {
    const env = await environment.getEnvironment();
    const region = env.getRegion();
    setUserRegion(region);
  };

  useEffect(() => {
    getRegion();
  }, [environment]);

  const orderLink = useMemo(
    () =>
      getHpcVmwareVCsphereExpressOrderLink({
        orderBaseUrl,
        region: userRegion,
      }),
    [userRegion],
  );

  return (
    <OnboardingLayout
      title={t('logs_onboarding_default_title')}
      description={
        <OdsText preset="paragraph" className="text-center">
          {t('logs_onboarding_default_description')}
          <Links
            type={LinkType.external}
            label={t('logs_onboarding_primary_cta_order')}
            target="_blank"
            href={orderLink}
            onClickReturn={() =>
              trackClick(TRACKING.logsOnboarding.activateLogsTransfertViaSyslog)
            }
          />
          <Links
            type={LinkType.external}
            label={t('logs_onboarding_secondary_cta')}
            target="_blank"
            href={guides.logs_data_platform}
            onClickReturn={() =>
              trackClick(TRACKING.logsOnboarding.goToSeeMoreLogs)
            }
          />
        </OdsText>
      }
    />
  );
};

export default LogsUpgrade;
