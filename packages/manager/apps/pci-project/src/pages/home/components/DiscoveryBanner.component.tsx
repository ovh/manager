import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  ODS_MESSAGE_VARIANT,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';

import { useProject, isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useActivationUrl } from '@/hooks/useActivationUrl';
import { useDiscoveryVoucher } from '@/hooks/home/useDiscoveryVoucher';
import { PROJECTS_TRACKING } from '@/tracking.constant';

function DiscoveryBanner({ className }: { className?: string }) {
  const { t } = useTranslation('home');
  const { data: project } = useProject();
  const { goToActivation } = useActivationUrl();
  const { trackClick } = useOvhTracking();

  const isDiscovery = project ? isDiscoveryProject(project) : false;
  const { data: voucherAmount } = useDiscoveryVoucher(isDiscovery);

  const handleActivationClick = () => {
    // Track the click action
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.PROJECT_HOME.CTA_DISCOVERY_BANNER,
    });

    // Navigate to activation
    goToActivation();
  };

  if (!project || !isDiscovery) {
    return null;
  }

  return (
    <>
      <OdsMessage
        color={ODS_MESSAGE_COLOR.information}
        variant={ODS_MESSAGE_VARIANT.default}
        className={`my-4 ${className}`}
        isDismissible={false}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col flex-1">
            <OdsText preset="heading-4">
              {voucherAmount
                ? t('pci_projects_home_banner_discovery_title_with_promotion', {
                    amount: voucherAmount,
                  })
                : t('pci_projects_home_banner_discovery_title_no_promotion')}
            </OdsText>
            <OdsText preset="paragraph">
              {t('pci_projects_home_banner_discovery_description')}
            </OdsText>
          </div>
          <OdsButton
            size={ODS_BUTTON_SIZE.md}
            onClick={handleActivationClick}
            label={t('pci_projects_home_banner_discovery_cta')}
            className="mr-4"
          />
        </div>
      </OdsMessage>
    </>
  );
}

export default DiscoveryBanner;
