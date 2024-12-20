import { OsdsButton, OsdsText, OsdsChip } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE, ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import {
  TilesInputComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useTranslateBytes } from '@/pages/new/hooks/useTranslateBytes';
import { StepState } from '@/pages/new/hooks/useStep';
import { TLocalisation } from '@/api/hooks/useRegions';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';
import { TVolumeAddon } from '@/api/data/catalog';

export interface VolumeTypeStepProps {
  projectId: string;
  region: TLocalisation;
  step: StepState;
  onSubmit: (volumeType: TVolumeAddon) => void;
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
  const [volumeType, setVolumeType] = useState<TVolumeAddon>(undefined);
  const tBytes = useTranslateBytes();
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const { data } = useVolumeCatalog(projectId);
  const volumeTypes = useMemo(
    () =>
      data?.models.filter(
        (m) =>
          m.pricingType === 'consumption' &&
          m.pricings.flatMap((p) => p.regions).includes(region.name),
      ) || [],
    [data, region],
  );

  const displayedTypes =
    volumeType && step.isLocked ? [volumeType] : volumeTypes;

  return (
    <>
      <TilesInputComponent<TVolumeAddon>
        value={volumeType}
        items={displayedTypes || []}
        label={(vType: TVolumeAddon) => (
          <div className="w-full">
            <div className="border-solid border-0 border-b border-b-[#85d9fd] py-3 d-flex">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._300}
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
