import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { OdsMessage, OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';

const FEATURE_FLAG = 'public-cloud:pci-announcement-banner';

export default function PciAnnouncementBanner() {
  const { t } = useTranslation('home');
  const { shell } = useContext(ShellContext);
  const location = useLocation();

  const [canDisplay, setCanDisplay] = useState(false);

  // Check feature flag availability
  const { data: availability } = useFeatureAvailability([FEATURE_FLAG]);

  useEffect(() => {
    const isFeatureAvailable = availability?.[FEATURE_FLAG] || false;

    if (isFeatureAvailable) {
      setCanDisplay(true);
    } else {
      setCanDisplay(false);
    }
  }, [availability]);

  const handleActivationRegionLinkClick = () => {
    // Navigate to regions activation page
    shell.navigation.navigateTo(
      'public-cloud',
      `#/pci/projects/${location.pathname.split('/')[3]}/activate`,
      {},
    );
  };

  // Don't display if feature flag is disabled, banner is dismissed, or still loading
  if (!canDisplay) {
    return null;
  }

  return (
    <div className="my-6 w-full" data-testid="pci-announcement-banner">
      <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={true}>
        <OdsText>
          {t('pci_projects_beta_public_cloud_banner_info')}{' '}
          <OdsButton
            variant="ghost"
            size="sm"
            label={t('pci_projects_beta_public_cloud_banner_info_link')}
            onClick={handleActivationRegionLinkClick}
            data-testid="pci-announcement-banner_activation-link"
          />
        </OdsText>
      </OdsMessage>
    </div>
  );
}
