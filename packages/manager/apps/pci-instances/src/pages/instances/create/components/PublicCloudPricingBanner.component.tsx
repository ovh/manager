import { FC, useContext, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Icon, Link } from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Banner from '@/components/banner/Banner.component';

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

export const PublicCloudPricingBanner: FC = () => {
  const { t } = useTranslation('creation');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const [isVisible, setIsVisible] = useState(true);

  const pricingUrl = PRICING_URLS[ovhSubsidiary] || PRICING_URLS.DEFAULT;

  if (!isVisible) return null;

  return (
    <div className="mb-4 w-full">
      <Banner
        color="information"
        className="w-full"
        dismissible
        onRemove={() => setIsVisible(false)}
      >
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {t('pci_instance_creation_pricing_banner_title')}
          </span>
          <span>{t('pci_instance_creation_pricing_banner_body')}</span>
          <Link
            href={pricingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {t('pci_instance_creation_pricing_banner_link')}
            <Icon name="external-link" className="inline" />
          </Link>
        </div>
      </Banner>
    </div>
  );
};
