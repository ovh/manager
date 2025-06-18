import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PciTrustedZoneBanner } from '@ovh-ux/manager-pci-common';
import { TRegion } from '@/api/data/regions';
import { EncryptionType } from '@/api/select/volume';
import { useVolumePricing } from '@/api/hooks/useCatalog';

interface ValidationStepProps {
  projectId: string;
  region: TRegion;
  volumeType: string;
  encryptionType: EncryptionType | null;
  volumeCapacity: number;
  onSubmit: () => void;
}

export function ValidationStep({
  volumeCapacity,
  projectId,
  region,
  volumeType,
  encryptionType,
  onSubmit,
}: Readonly<ValidationStepProps>) {
  const { t } = useTranslation('add');
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();

  const { data } = useVolumePricing(
    projectId,
    region.name,
    volumeType,
    encryptionType,
    volumeCapacity,
  );

  return (
    <div className="mb-6">
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('pci_projects_project_storages_blocks_add_submit_price_text', {
          price: data.monthlyPrice.value,
        })}
      </OsdsText>
      <div className="my-5">
        <PciTrustedZoneBanner />
      </div>
      <div className="flex flex-row">
        <OsdsButton
          className="mt-4 mr-4 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
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
