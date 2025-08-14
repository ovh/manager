import { OsdsButton, OsdsModal } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { useVolumeWithCatalog } from '@/api/hooks/useVolume';

export const RetypePage = () => {
  const { t } = useTranslation(['stepper', 'add', 'common']);
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const { volumeData, catalogData, isPending } = useVolumeWithCatalog(
    projectId,
    volumeId,
  );
  const { formatBytes } = useBytes();
  const onClose = () => navigate('..');

  const [newVolumeType, setNewVolumeType] = useState<
    typeof volumeTypes[number]
  >(undefined);

  const volumeTypes = useMemo(
    () =>
      catalogData?.map((m) => ({
        ...m,
        label: m.displayName,
        description:
          m.availabilityZonesCount !== null
            ? t(
                'add:pci_projects_project_storages_blocks_add_type_availability_zone',
                { count: m.availabilityZonesCount },
              )
            : undefined,
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
    [catalogData],
  );

  console.info({ volumeData });
  console.info({ volumeTypes });

  useEffect(() => {
    const currentType = volumeTypes.find((v) =>
      v.possibleTechnicalNames?.includes(
        volumeData.type as Opaque<string, 'TechnicalName'>,
      ),
    );
    setNewVolumeType(currentType);
  }, [volumeTypes?.length, volumeData?.type]);

  return (
    <OsdsModal headline="test" onOdsModalClose={onClose}>
      <slot>
        {!isPending && volumeData && catalogData ? (
          <div>
            <div>name {volumeData.name}</div>
            <div>region {volumeData.region}</div>
            <div>desc {volumeData.description}</div>
            <TilesInput
              name="volume-type"
              label="dfghdfghdfgh"
              value={newVolumeType}
              elements={volumeTypes}
              onChange={(e) => setNewVolumeType(e)}
            />
          </div>
        ) : (
          <div>loading...</div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        Annulllller
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => alert('validation')}
      >
        Valllllider
      </OsdsButton>
    </OsdsModal>
  );
};

export default RetypePage;
