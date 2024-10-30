import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  TilesInputComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { TAddon, TCatalog } from '@ovh-ux/manager-pci-common';
import { useTranslateBytes } from '@/pages/new/hooks/useTranslateBytes';
import { useConsumptionVolumesAddon } from '@/api/hooks/useConsumptionVolumesAddon';
import { StepState } from '@/pages/new/hooks/useStep';
import { TLocalisation } from '@/api/hooks/useRegions';

export interface VolumeTypeStepProps {
  projectId: string;
  region: TLocalisation;
  step: StepState;
  onSubmit: (volumeType: TAddon) => void;
}

export function VolumeTypeStep({
  projectId,
  region,
  step,
  onSubmit,
}: Readonly<VolumeTypeStepProps>) {
  const { t } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');
  const { t: tCommon } = useTranslation('common');
  const [volumeType, setVolumeType] = useState<TAddon>(undefined);
  const tBytes = useTranslateBytes();
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const { volumeTypes, isPending } = useConsumptionVolumesAddon(
    projectId,
    region,
  );

  const displayedTypes =
    volumeType && step.isLocked ? [volumeType] : volumeTypes;

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      <TilesInputComponent<TCatalog['addons'][0]>
        value={volumeType}
        items={displayedTypes || []}
        label={(vType: TCatalog['addons'][0]) => (
          <div className="w-full">
            <div className="border-solid border-0 border-b border-b-[#85d9fd] py-3 d-flex">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {vType.blobs.technical.name}
              </OsdsText>
              {vType.blobs.tags.includes('is_new') && (
                <OsdsChip
                  className="ms-3"
                  color={ODS_THEME_COLOR_INTENT.success}
                  size={ODS_CHIP_SIZE.sm}
                  inline
                >
                  {tCommon('pci_projects_project_storages_blocks_new')}
                </OsdsChip>
              )}
            </div>
            <div className="py-3">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {vType.blobs.technical.volume.iops.guaranteed
                  ? t(
                      'pci_projects_project_storages_blocks_add_type_addon_iops_guaranteed',
                      {
                        iops: vType.blobs.technical.volume.iops.level,
                        separator: ', ',
                      },
                    )
                  : t(
                      'pci_projects_project_storages_blocks_add_type_addon_iops_not_guaranteed',
                      {
                        iops:
                          vType.blobs.technical.volume.iops.max ||
                          vType.blobs.technical.volume.iops.level,
                        separator: ', ',
                      },
                    )}
                {t(
                  'pci_projects_project_storages_blocks_add_type_addon_capacity_max',
                  {
                    capacity: tBytes(
                      vType.blobs.technical.volume.capacity.max,
                      0,
                      false,
                      'GB',
                      false,
                    ),
                  },
                )}{' '}
                <br />
                {t(
                  'pci_projects_project_storages_blocks_add_type_addon_price',
                  {
                    price: getFormattedCatalogPrice(vType.pricings[0]?.price),
                  },
                )}
              </OsdsText>
            </div>
          </div>
        )}
        onInput={setVolumeType}
      />
      {volumeType && !step.isLocked && (
        <div className="mt-6">
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => onSubmit(volumeType)}
            className="w-fit"
          >
            {tStepper('common_stepper_next_button_label')}
          </OsdsButton>
        </div>
      )}
    </>
  );
}
