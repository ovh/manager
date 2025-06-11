import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_MESSAGE_COLOR, ODS_MESSAGE_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useDiscoveryVoucher } from '@/hooks/home/useDiscoveryVoucher';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

function DiscoveryBanner({ className }: { className?: string }) {
  const { t } = useTranslation(['home', NAMESPACES.ACTIONS]);

  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: voucherAmount, isPending: isVoucherPending } = useDiscoveryVoucher();

  const handleActivationClick = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.PROJECT_HOME.CTA_DISCOVERY_BANNER,
    });

    navigate(urls.activate);
  };

  if (isVoucherPending) {
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
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-1 flex-col">
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
            label={t('activate', { ns: NAMESPACES.ACTIONS })}
            className="mr-4"
          />
        </div>
      </OdsMessage>
    </>
  );
}

export default DiscoveryBanner;
