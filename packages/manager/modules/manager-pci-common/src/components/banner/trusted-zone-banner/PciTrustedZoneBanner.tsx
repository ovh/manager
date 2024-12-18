import { useTranslation } from 'react-i18next';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsText, OdsMessage } from '@ovhcloud/ods-components/react';
import { useTrustedZoneBanner } from './useTrustedZoneBanner.hook';

import '../../../translations/trusted-zone-banner';

export function PciTrustedZoneBanner() {
  const { t } = useTranslation('pci-trusted-zone-banner');

  const { isBannerVisible } = useTrustedZoneBanner();

  return (
    <>
      {isBannerVisible && (
        <OdsMessage color={ODS_MESSAGE_COLOR.information}>
          <OdsText preset="span">
            {t('pci_projects_trusted_zone_banner_info')}
          </OdsText>
        </OdsMessage>
      )}
    </>
  );
}
