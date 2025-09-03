import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

import { Trans, useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { StepState } from '@/pages/new/hooks/useStep';
import {
  useVolumeModels,
  TVolumeModel,
  useVolumeEncryptions,
} from '@/api/hooks/useCatalog';
import { TRegion } from '@/api/data/regions';
import { MULTI_ATTACH_INFO_URL } from '@/constants';
import { Encryption } from './Encryption';
import { EncryptionType } from '@/api/select/volume';
import ExternalLink from '@/components/ExternalLink';
import { Button } from '@/components/button/Button';

export interface VolumeTypeStepProps {
  projectId: string;
  region: TRegion;
  step: StepState;
  onSubmit: (
    volumeType: TVolumeModel['name'],
    showAvailabilityZones: boolean,
    encryption: EncryptionType | null,
  ) => void;
}

export function VolumeTypeStep({
  projectId,
  region,
  step,
  onSubmit,
}: Readonly<VolumeTypeStepProps>) {
  const { t } = useTranslation(['stepper', 'add', 'common']);
  const { formatBytes } = useBytes();
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });
  const { data } = useVolumeModels(projectId, region.name);
  const { defaultValue: encryptionDefaultValue } = useVolumeEncryptions();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const volumeTypes = useMemo(
    () =>
      data?.map((m) => ({
        ...m,
        label: m.displayName,
        description:
          m.availabilityZonesCount !== null
            ? t(
                'add:pci_projects_project_storages_blocks_add_type_availability_zone',
                { count: m.availabilityZonesCount },
              )
            : undefined,
        badges: [
          m.encrypted
            ? {
                label: t(
                  'common:pci_projects_project_storages_blocks_encryption_available',
                ),
                backgroundColor: '#D2F2C2',
                textColor: '#113300',
                icon: 'lock' as const,
              }
            : {
                label: t(
                  'common:pci_projects_project_storages_blocks_encryption_unavailable',
                ),
                backgroundColor: '#FFCCD9',
                textColor: '#4D000D',
                icon: 'lock' as const,
              },
        ],
        features: [
          m.iops,
          t(
            'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
            {
              capacity: formatBytes(m.capacity.max),
            },
          ),
        ].concat(m.bandwidth ? [m.bandwidth] : []),
        price: m.hourlyPrice,
      })) || [],
    [data, region, getFormattedCatalogPrice],
  );
  const [volumeType, setVolumeType] = useState<typeof volumeTypes[number]>(
    undefined,
  );
  const [encryptionType, setEncryptionType] = useState<EncryptionType | null>(
    null,
  );

  useEffect(() => {
    if (volumeType)
      setEncryptionType(volumeType.encrypted ? encryptionDefaultValue : null);
  }, [volumeType]);

  const attachGuideLink =
    MULTI_ATTACH_INFO_URL[ovhSubsidiary] || MULTI_ATTACH_INFO_URL.DEFAULT;

  return (
    <>
      <TilesInput
        name="volume-type"
        label=""
        value={volumeType}
        elements={volumeTypes}
        onChange={(e) => setVolumeType(e)}
        locked={step.isLocked}
      />
      {volumeType?.shouldUseMultiAttachFileSystem && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.warning}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            hue={ODS_TEXT_COLOR_HUE._700}
          >
            <Trans
              t={t}
              i18nKey="add:pci_projects_project_storages_blocks_add_type_multi_attach_banner"
              components={{
                Link: (
                  <ExternalLink href={attachGuideLink} isTargetBlank={false} />
                ),
              }}
            />
          </OsdsText>
        </OsdsMessage>
      )}
      {volumeType?.encrypted && (
        <Encryption
          encryptionType={encryptionType}
          onChange={(e) => setEncryptionType(e)}
        />
      )}
      {volumeType && !step.isLocked && (
        <div className="mt-8">
          <Button
            size="md"
            color="primary"
            onClick={() =>
              onSubmit(
                volumeType.name,
                volumeType.showAvailabilityZones,
                encryptionType,
              )
            }
            actionName="select_volume_add"
            actionValues={[volumeType.name]}
            className="w-fit"
          >
            {t('common_stepper_next_button_label')}
          </Button>
        </div>
      )}
    </>
  );
}
