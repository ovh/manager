import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { sortByPreselectedModel } from '@/api/select/catalog';
import { capitalizeFirstLetter } from '@/utils';

type Props<T = TVolumeModel | TVolumeRetypeModel> = {
  volumeModels: T[];
  value: T | null;
  onChange: (value: T) => void;
  label: string;
  locked?: boolean;
  horizontal?: boolean;
  hideBadges?: boolean;
};

export const VolumeModelTilesInput = ({
  volumeModels = [],
  value,
  onChange,
  label = '',
  locked = false,
  horizontal = false,
  hideBadges = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { formatBytes } = useBytes();

  const getDescription = useCallback(
    (model: TVolumeModel | TVolumeRetypeModel) => {
      const zoneText = model.availabilityZonesCount
        ? t(
            'add:pci_projects_project_storages_blocks_add_type_availability_zone',
            { count: model.availabilityZonesCount },
          )
        : undefined;

      const capacityMax = t(
        'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
        {
          capacity: formatBytes(model.capacity.max),
        },
      );

      if (horizontal) {
        const zoneDescription = zoneText ? `${zoneText}.\n` : '';
        const bandwidth = model.bandwidth ? `${model.bandwidth}, ` : '';
        return `${zoneDescription}${model.iops}, ${bandwidth}${capacityMax}`;
      }

      return zoneText;
    },
    [t, formatBytes],
  );

  const getFeatures = useCallback(
    (m: TVolumeModel | TVolumeRetypeModel) => {
      if (horizontal) return [];

      return [
        m.iops,
        t(
          'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
          {
            capacity: formatBytes(m.capacity.max),
          },
        ),
        ...(m.bandwidth ? [m.bandwidth] : []),
      ];
    },
    [t, formatBytes],
  );

  const volumeTypes = useMemo(
    () =>
      sortByPreselectedModel(volumeModels).map((model) => ({
        ...model,
        label: capitalizeFirstLetter(model.displayName),
        description: getDescription(model),
        badges: hideBadges
          ? []
          : [
              {
                label: t(
                  `common:pci_projects_project_storages_blocks_encryption_${
                    model.encrypted ? 'available' : 'unavailable'
                  }`,
                ),
                backgroundColor: model.encrypted ? '#D2F2C2' : '#FFCCD9',
                textColor: model.encrypted ? '#113300' : '#4D000D',
                icon: 'lock' as const,
              },
            ],
        features: getFeatures(model),
        price: model.hourlyPrice,
      })),
    [volumeModels, t, getDescription, getFeatures],
  );

  const volumeTypeValue = useMemo(
    () => volumeTypes?.find((v) => v.name === value?.name),
    [volumeModels, value],
  );

  return (
    <div
      className={clsx(
        horizontal && 'whitespace-pre-line [&_osds-text]:leading-[130%]',
      )}
    >
      <Text preset={TEXT_PRESET.heading5} className="mt-4">
        {label}
      </Text>
      <TilesInput
        name="volume-type"
        label={undefined}
        value={volumeTypeValue}
        elements={volumeTypes}
        onChange={(e) => onChange(e)}
        locked={locked}
        horizontal={horizontal}
      />
    </div>
  );
};
