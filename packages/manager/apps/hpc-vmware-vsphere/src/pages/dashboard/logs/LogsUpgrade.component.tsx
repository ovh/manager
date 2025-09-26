import { Region } from '@ovh-ux/manager-config';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { getHpcVmwareVCsphereExpressOrderLink } from '@/utils/order-utils';

const LogsUpgrade = () => {
  const orderBaseUrl = useOrderURL('express_review_base');
  const { t } = useTranslation('onboarding');
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [userRegion, setUserRegion] = useState<Region>();
  const guides = useGuideUtils(LANDING_URL);

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
      orderButtonLabel={t('logs_onboarding_primary_cta_order')}
      orderHref={orderLink}
      moreInfoButtonLabel={t('logs_onboarding_secondary_cta')}
      moreInfoHref={guides.logs_data_platform}
      description={
        <OdsText preset="paragraph" className="text-center">
          {t('logs_onboarding_default_description')}
        </OdsText>
      }
    />
  );
};

export default LogsUpgrade;
