import {
  ConfigCardElementProps,
  TilesInput,
  useBytes,
} from '@ovh-ux/manager-pci-common';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Divider, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
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
  disabled?: boolean;
};

export const VolumeModelTilesInput = ({
  volumeModels = [],
  value,
  onChange,
  label = '',
  locked = false,
  horizontal = false,
  hideBadges = false,
  disabled = false,
}: Props) => {
  const { t } = useTranslation(['add', 'common']);
  const { formatBytes } = useBytes();

  const getDescription = useCallback(
    (model: TVolumeModel | TVolumeRetypeModel) => {
      const availabilityZonesText = model.availabilityZonesCount
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
        return (
          <div>
            {availabilityZonesText && <div>{availabilityZonesText}</div>}
            <ul className="pl-5 mb-0 list-['✓']">
              {model.iops && (
                <>
                  <li className="pl-5 marker:text-[#2b8000]">{model.iops}</li>
                  {model.iopsBaseRange && (
                    <Text className="pl-5" preset={TEXT_PRESET.caption}>
                      {model.iopsBaseRange}
                    </Text>
                  )}
                </>
              )}
              {model.bandwidth && (
                <>
                  <li className="pl-5 marker:text-[#2b8000]">
                    {model.bandwidth}
                  </li>
                  {model.bandwidthBaseRange && (
                    <Text className="pl-5" preset={TEXT_PRESET.caption}>
                      {model.bandwidthBaseRange}
                    </Text>
                  )}
                </>
              )}
              {capacityMax && (
                <li className="pl-5 marker:text-[#2b8000]">{capacityMax}</li>
              )}
            </ul>
          </div>
        );
      }

      return availabilityZonesText;
    },
    [t, formatBytes],
  );

  const getFeatures = useCallback(
    (m: TVolumeModel | TVolumeRetypeModel) => {
      if (horizontal) return [];

      return [
        <>
          <span>{m.iops}</span>
          {m.iopsBaseRange && (
            <>
              <br />
              <Text preset={TEXT_PRESET.caption}>{m.iopsBaseRange}</Text>
            </>
          )}
        </>,
        t(
          'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
          {
            capacity: formatBytes(m.capacity.max),
          },
        ),
        ...(m.bandwidth
          ? [
              <>
                <span>{m.bandwidth}</span>
                {m.bandwidthBaseRange && (
                  <>
                    <br />
                    <Text preset={TEXT_PRESET.caption}>
                      {m.bandwidthBaseRange}
                    </Text>
                  </>
                )}
              </>,
            ]
          : []),
      ];
    },
    [t, formatBytes],
  );

  const volumeTypes = useMemo(
    () =>
      sortByPreselectedModel(volumeModels).map((model) => ({
        ...model,
        label: capitalizeFirstLetter(model.displayName),
        description: getDescription(model) as string,
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
        features: getFeatures(model) as string[],
        price: model.hourlyPrice,
      })),
    [volumeModels, t, getDescription, getFeatures],
  );

  const volumeTypeValue = useMemo(
    () => volumeTypes?.find((v) => v.name === value?.name),
    [volumeModels, value],
  );

  const disableAllProps = useCallback(
    (e: typeof volumeTypes[number] & { disabled: boolean }) => {
      // We can't directly disable the input tiles. In waiting for changing the lib used, we do this instead.
      // eslint-disable-next-line no-param-reassign
      e.disabled = disabled;
      return e;
    },
    [disabled],
  );

  return (
    <div
      className={clsx(
        'whitespace-pre-line',
        horizontal && '[&_osds-text]:leading-[130%]',
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
        inputProps={disableAllProps}
      />
    </div>
  );
};
