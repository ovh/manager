import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { aapi } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import './translations/trusted-zone';

const TRUSTED_ZONE = 'public-cloud:trusted-zone';

export async function fetchTrustedZoneFeature() {
  const { data } = await aapi.get(`/feature/${TRUSTED_ZONE}/availability`);
  return data;
}

export function PciTrustedZoneBanner() {
  const [t] = useTranslation('pci-trusted-zone-banner');

  /**
   * Indicate if customer is trusted zone program
   * @param pciFeatures {OvhFeatureFlipping} : ovhFeatureFlipping instance
   * @returns {boolean}: true if customer is trusted, otherwise false
   */
  const {
    data: featureAvailabilityData,
    isLoading: isFeatureAvailabilityLoading,
  } = useQuery<Record<string, boolean>>({
    queryKey: ['feature', TRUSTED_ZONE],
    queryFn: fetchTrustedZoneFeature,
  });

  const isTrustedZone =
    featureAvailabilityData &&
    featureAvailabilityData[TRUSTED_ZONE] &&
    !isFeatureAvailabilityLoading;

  return (
    <>
      {isTrustedZone && (
        <OdsMessage>
          <OdsText>{t('pci_projects_trusted_zone_banner_info')}</OdsText>
        </OdsMessage>
      )}
    </>
  );
}
