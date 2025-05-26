import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { PciTrustedZoneBanner } from '@ovh-ux/manager-pci-common';
import { TRegion } from '@/api/data/regions';
import { EncryptionType } from '@/api/select/volume';
import { TVolumeModel, useVolumePricing } from '@/api/hooks/useCatalog';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { Button } from '@/components/button/Button';

interface ValidationStepProps {
  projectId: string;
  region: TRegion;
  volumeType: TVolumeModel['name'];
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
  onSubmit: propsOnSubmit,
}: Readonly<ValidationStepProps>) {
  const { t } = useTranslation('add');

  const { data } = useVolumePricing(
    projectId,
    region.name,
    volumeType,
    encryptionType,
    volumeCapacity,
  );

  const actionValues = [region.name, volumeType];

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
        <Button
          className="mt-4 mr-4 w-fit"
          size="md"
          color="primary"
          onClick={propsOnSubmit}
          actionName="confirm"
          actionValues={actionValues}
        >
          {t('pci_projects_project_storages_blocks_add_submit_label')}
        </Button>
        <ButtonLink
          className="mt-4 w-fit"
          size="md"
          color="primary"
          variant="ghost"
          to=".."
          actionName="cancel"
          actionValues={actionValues}
        >
          {t('pci_projects_project_storages_blocks_add_submit_cancel_label')}
        </ButtonLink>
      </div>
    </div>
  );
}
