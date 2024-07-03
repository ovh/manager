import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-core-application';
import './translations/trusted-zone';

const TRUSTED_ZONE = 'public-cloud:trusted-zone';

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
  } = useFeatureAvailability([TRUSTED_ZONE]);

  const isTrustedZone =
    featureAvailabilityData &&
    featureAvailabilityData[TRUSTED_ZONE] &&
    !isFeatureAvailabilityLoading;

  return (
    <>
      {isTrustedZone && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.info}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_projects_trusted_zone_banner_info')}
          </OsdsText>
        </OsdsMessage>
      )}
    </>
  );
}
