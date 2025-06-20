import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PciTrustedZoneBanner } from '@ovh-ux/manager-pci-common';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { PriceEstimate } from '@/pages/new/components/PriceEstimate';
import { TVolumePricing } from '@/api/data/catalog';

interface ValidationStepProps {
  volumeCapacity: number;
  pricing: TVolumePricing;
  onSubmit: () => void;
}

export function ValidationStep({
  volumeCapacity,
  pricing,
  onSubmit,
}: Readonly<ValidationStepProps>) {
  const { t } = useTranslation('add');
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { trackClick } = useOvhTracking();

  return (
    <div className="mb-6">
      <PriceEstimate volumeCapacity={volumeCapacity} pricing={pricing} />
      <div className="my-5">
        <PciTrustedZoneBanner />
      </div>
      <div className="flex flex-row">
        <OsdsButton
          className="mt-4 mr-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            trackClick({
              buttonType: ButtonType.button,
              actions: ['confirm'],
            });

            clearNotifications();
            onSubmit();
          }}
        >
          {t('pci_projects_project_storages_blocks_add_submit_label')}
        </OsdsButton>
        <OsdsButton
          className="mt-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => {
            trackClick({
              buttonType: ButtonType.button,
              actions: ['cancel'],
            });

            clearNotifications();
            navigate('..');
          }}
        >
          {t('pci_projects_project_storages_blocks_add_submit_cancel_label')}
        </OsdsButton>
      </div>
    </div>
  );
}
