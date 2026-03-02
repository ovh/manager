import { useContext, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_MESSAGE_VARIANT } from '@ovhcloud/ods-components';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const PRICING_URLS: Record<string, string> = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/',
  US: 'https://us.ovhcloud.com/public-cloud/prices/',
};

export default function PublicCloudPricingBanner() {
  const { t } = useTranslation('home');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const [isVisible, setIsVisible] = useState(true);

  const pricingUrl = (ovhSubsidiary && PRICING_URLS[ovhSubsidiary]) || PRICING_URLS.DEFAULT;

  if (!isVisible) return null;

  return (
    <div className="my-6 w-full">
      <OdsMessage
        color={ODS_MESSAGE_COLOR.information}
        variant={ODS_MESSAGE_VARIANT.default}
        isDismissible
        onOdsRemove={() => setIsVisible(false)}
        data-testid="public-cloud-pricing-banner"
      >
        <div className="flex flex-col gap-1">
          <OdsText preset="heading-6">{t('pci_projects_home_pricing_banner_title')}</OdsText>
          <OdsText preset="paragraph">{t('pci_projects_home_pricing_banner_body')}</OdsText>
          <OdsLink
            href={pricingUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            icon="external-link"
            label={t('pci_projects_home_pricing_banner_link')}
            className="block"
          />
        </div>
      </OdsMessage>
    </div>
  );
}
