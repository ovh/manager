import {
  Links,
  LinkType,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

const LogsUpgrade = () => {
  const { t } = useTranslation('onboarding');

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
            href="https://www.ovh.com/fr/order/privateCloud/?v=2&_gl=1*12h9l9*_gcl_aw*R0NMLjE3NDIzNjgwMzYuQ2owS0NRancxdW0tQmhEdEFSSXNBQmpVNXg0ZHk2djR4RW1xcWNuRWFIblVBVjNBT3BkLUZORmRuLUFLeVotVGRrMWFTU1QtWC1HbGhNSWFBZ25MRUFMd193Y0I.*_gcl_au*MzE0Njk5OTQ4LjE3NDE2MDUxNzkuMTMyNjU2MzM3LjE3NDE4OTQyMjAuMTc0MTg5NDQzNg..#/private-cloud/build?selection=%7E(range%7E%27vsphere%7EservicePack%7E%27vrops-nsxt)"
          />
          <Links
            type={LinkType.external}
            label={t('logs_onboarding_secondary_cta')}
            target="_blank"
            href="https://www.ovhcloud.com/fr/identity-security-operations/logs-data-platform/"
          />
        </OdsText>
      }
    />
  );
};

export default LogsUpgrade;
