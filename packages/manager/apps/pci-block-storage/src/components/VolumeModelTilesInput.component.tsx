import { TilesInput, useBytes } from '@ovh-ux/manager-pci-common';
import { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { sortByPreselectedModel } from '@/api/select/catalog';
import { capitalizeFirstLetter } from '@/utils';

type AnyVolumeModel = TVolumeModel | TVolumeRetypeModel;

type Props = {
  volumeModels: AnyVolumeModel[];
  value: AnyVolumeModel | null;
  onChange: (value: AnyVolumeModel) => void;
  label: string;
  locked?: boolean;
  horizontal?: boolean;
  hideBadges?: boolean;
  disabled?: boolean;
};

// ConfigCard's `description` and `features` are typed as plain strings but
// render their content via `{children}` — React accepts any ReactNode at
// runtime. This cast localises the lie to one place.
const asConfigCardSlot = <T,>(node: ReactNode): T => (node as unknown) as T;

const BaseRangeLine = ({ children }: { children: ReactNode }) => (
  <span className="bs-base-range text-xs opacity-70">{children}</span>
);

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

  // One ticked line per metric. The optional base-range string is rendered
  // inline below its parent (no extra <li> → no extra tick).
  type SpecGroup = { key: string; main: string; sub?: string };
  const buildSpecGroups = useCallback(
    (m: AnyVolumeModel): SpecGroup[] => {
      const capacityMax = t(
        'add:pci_projects_project_storages_blocks_add_type_addon_capacity_max',
        { capacity: formatBytes(m.capacity.max) },
      );

      const groups: SpecGroup[] = [
        { key: 'iops', main: m.iops, sub: m.iopsBaseRange },
        { key: 'cap', main: capacityMax },
      ];
      if (m.bandwidth) {
        groups.push({
          key: 'bw',
          main: m.bandwidth,
          sub: m.bandwidthBaseRange,
        });
      }
      return groups;
    },
    [t, formatBytes],
  );

  const buildZoneText = useCallback(
    (m: AnyVolumeModel) =>
      m.availabilityZonesCount
        ? t(
            'add:pci_projects_project_storages_blocks_add_type_availability_zone',
            { count: m.availabilityZonesCount },
          )
        : undefined,
    [t],
  );

  // Render the spec list ourselves (plain flex rows, manual ✓ marker) and
  // route it through `description` for both horizontal and vertical layouts.
  // Going through ConfigCard's <ul>/<li> + `features` slot brings two
  // problems: (1) ConfigCard uses each feature entry as the <li> React key,
  // so JSX entries collide on `[object Object]` and stale items pile up
  // across locale switches; (2) the default `config-card__features` layout
  // gives us no control over inter-row spacing.
  const buildSpecListNode = useCallback(
    (m: AnyVolumeModel): ReactNode => {
      const zoneText = buildZoneText(m);
      const groups = buildSpecGroups(m);
      return (
        <>
          {zoneText && <span className="block">{zoneText}</span>}
          <div className="flex flex-col gap-4">
            {groups.map(({ key, main, sub }) => (
              <div
                key={`spec-${m.name}-${key}`}
                className="flex items-start gap-2"
              >
                <span
                  aria-hidden
                  className="text-[#2b8000] font-bold leading-[1]"
                >
                  ✓
                </span>
                <div>
                  <div>{main}</div>
                  {sub && <BaseRangeLine>{sub}</BaseRangeLine>}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    },
    [buildZoneText, buildSpecGroups],
  );

  const buildBadges = useCallback(
    (m: AnyVolumeModel) =>
      hideBadges
        ? []
        : [
            {
              label: t(
                `common:pci_projects_project_storages_blocks_encryption_${
                  m.encrypted ? 'available' : 'unavailable'
                }`,
              ),
              backgroundColor: m.encrypted ? '#D2F2C2' : '#FFCCD9',
              textColor: m.encrypted ? '#113300' : '#4D000D',
              icon: 'lock' as const,
            },
          ],
    [hideBadges, t],
  );

  const tiles = useMemo(
    () =>
      sortByPreselectedModel(volumeModels).map((m) => ({
        ...m,
        label: capitalizeFirstLetter(m.displayName),
        badges: buildBadges(m),
        price: m.hourlyPrice,
        description: asConfigCardSlot<string>(buildSpecListNode(m)),
        // Intentionally undefined: ConfigCard pushes an empty <ul> body
        // section for `features: []`, which adds a divider + extra spacing.
        features: undefined,
      })),
    [volumeModels, buildBadges, buildSpecListNode],
  );

  const selectedTile = useMemo(
    () => tiles.find((tile) => tile.name === value?.name),
    [tiles, value],
  );

  const setTileDisabled = useCallback(
    (tile: typeof tiles[number] & { disabled: boolean }) => {
      // Underlying lib has no disabled prop; mutate per-tile input props.
      // eslint-disable-next-line no-param-reassign
      tile.disabled = disabled;
      return tile;
    },
    [disabled],
  );

  return (
    <div className={clsx(horizontal && '[&_osds-text]:leading-[130%]')}>
      <Text preset={TEXT_PRESET.heading5} className="mt-4">
        {label}
      </Text>
      <TilesInput
        name="volume-type"
        label={undefined}
        value={selectedTile}
        elements={tiles}
        onChange={(tile) => onChange(tile as AnyVolumeModel)}
        locked={locked}
        horizontal={horizontal}
        inputProps={setTileDisabled}
      />
    </div>
  );
};
