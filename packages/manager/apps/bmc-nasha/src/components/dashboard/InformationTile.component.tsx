import { useTranslation } from 'react-i18next';

import { ActionMenu, Tile } from '@ovh-ux/muk';

import type { Nasha } from '@/types/Dashboard.type';

type InformationTileProps = {
  nasha: Nasha;
  onEditName: () => void;
};

export function InformationTile({ nasha, onEditName }: InformationTileProps) {
  const { t } = useTranslation('dashboard');

  const name = nasha.customName || nasha.serviceName;

  return (
    <Tile.Root title={t('information.title')}>
      {/* Name */}
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('information.name')}
          actions={
            <ActionMenu
              id="edit-name-menu"
              isCompact
              items={[
                {
                  id: 1,
                  label: t('actions.edit'),
                  onClick: onEditName,
                },
              ]}
            />
          }
        />
        <Tile.Item.Description label={name} />
      </Tile.Item.Root>

      {/* ID */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('information.id')} />
        <Tile.Item.Description label={nasha.serviceName} />
      </Tile.Item.Root>

      {/* Datacenter */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('information.datacenter')} />
        <Tile.Item.Description label={nasha.localeDatacenter} />
      </Tile.Item.Root>

      {/* Disk Type */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('information.disk_type')} />
        <Tile.Item.Description label={nasha.diskType} />
      </Tile.Item.Root>

      {/* Disk Size */}
      <Tile.Item.Root>
        <Tile.Item.Term label={t('information.disk_size')} />
        <Tile.Item.Description label={nasha.diskSize} />
      </Tile.Item.Root>
    </Tile.Root>
  );
}
