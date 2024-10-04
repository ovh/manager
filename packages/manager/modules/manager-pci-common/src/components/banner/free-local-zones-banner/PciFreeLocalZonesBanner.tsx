import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionBanner } from '@ovh-ux/manager-react-components';

import '../../../translations/free-local-zones-banner';

export const URLs = {
  DEFAULT:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/local-zone/',
  ASIA:
    'https://www.ovhcloud.com/asia/about-us/global-infrastructure/local-zone/',
  AU:
    'https://www.ovhcloud.com/en-au/about-us/global-infrastructure/local-zone/',
  CA:
    'https://www.ovhcloud.com/en-ca/about-us/global-infrastructure/local-zone/',
  DE: 'https://www.ovhcloud.com/de/about-us/global-infrastructure/local-zone/',
  ES:
    'https://www.ovhcloud.com/es-es/about-us/global-infrastructure/local-zone/',
  FR: 'https://www.ovhcloud.com/fr/about-us/global-infrastructure/local-zone/',
  GB:
    'https://www.ovhcloud.com/en-gb/about-us/global-infrastructure/local-zone/',
  IE:
    'https://www.ovhcloud.com/en-ie/about-us/global-infrastructure/local-zone/',
  IN:
    'https://www.ovhcloud.com/en-in/about-us/global-infrastructure/local-zone/',
  IT: 'https://www.ovhcloud.com/it/about-us/global-infrastructure/local-zone/',
  MA:
    'https://www.ovhcloud.com/fr-ma/about-us/global-infrastructure/local-zone/',
  NL: 'https://www.ovhcloud.com/nl/about-us/global-infrastructure/local-zone/',
  PL: 'https://www.ovhcloud.com/pl/about-us/global-infrastructure/local-zone/',
  PT: 'https://www.ovhcloud.com/pt/about-us/global-infrastructure/local-zone/',
  QC:
    'https://www.ovhcloud.com/fr-ca/about-us/global-infrastructure/local-zone/',
  SG:
    'https://www.ovhcloud.com/en-sg/about-us/global-infrastructure/local-zone/',
  SN:
    'https://www.ovhcloud.com/fr-sn/about-us/global-infrastructure/local-zone/',
  TN:
    'https://www.ovhcloud.com/fr-tn/about-us/global-infrastructure/local-zone/',
  WE: 'https://www.ovhcloud.com/en/about-us/global-infrastructure/local-zone/',
  WS: 'https://www.ovhcloud.com/es/about-us/global-infrastructure/local-zone/',
  US: 'https://us.ovhcloud.com/public-cloud/local-zone/',
};

export interface PciFreeLocalZonesBannerProps {
  ovhSubsidiary: string;
  showConfirm: boolean;
}

export function PciFreeLocalZonesBanner({
  ovhSubsidiary,
  showConfirm,
}: Readonly<PciFreeLocalZonesBannerProps>): ReactNode {
  const { t } = useTranslation('pci-free-local-zones-banner');

  return (
    <ActionBanner
      message={t(
        `pci_free_local_zones_banner_text${showConfirm ? '_confirm' : ''}`,
      )}
      cta={t('pci_free_local_zones_banner_link')}
      href={URLs[ovhSubsidiary as keyof typeof URLs] || URLs.DEFAULT}
    />
  );
}
