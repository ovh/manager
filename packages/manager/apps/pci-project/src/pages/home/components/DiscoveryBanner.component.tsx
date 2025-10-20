import {
  ODS_BUTTON_SIZE,
  ODS_MESSAGE_COLOR,
  ODS_MESSAGE_VARIANT,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { useDiscoveryVoucher } from '@/hooks/home/useDiscoveryVoucher';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

function DiscoveryBanner({ className }: { className?: string }) {
  const { t } = useTranslation('home');

  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: voucherAmount } = useDiscoveryVoucher();

  const handleActivationClick = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.PROJECT_HOME.CTA_DISCOVERY_BANNER,
    });

    navigate(urls.activate);
  };

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
