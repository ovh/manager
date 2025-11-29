import { useTranslation } from 'react-i18next';

import { Button, Icon, Tile } from '@ovh-ux/muk';

type Nasha = {
  serviceName: string;
  customName?: string;
  localeDatacenter: string;
  diskType: string;
  diskSize: string;
};

type InformationTileProps = {
  nasha: Nasha | null | undefined;
  displayName: string | undefined;
  onEditName: () => void;
};

export default function InformationTile({ nasha, displayName, onEditName }: InformationTileProps) {
  const { t } = useTranslation(['dashboard']);

  if (!nasha || !displayName) {
    return null;
  }

  return (
    <Tile.Root title={t('dashboard:information.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:information.name')} />
        <Tile.Item.Description>
          <div className="flex items-center">
            <span>{displayName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditName}
              className="ml-2"
              aria-label={t('dashboard:edit', 'Edit')}
            >
              <Icon name="pen" />
            </Button>
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:information.id')} />
        <Tile.Item.Description>{nasha.serviceName}</Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:information.datacenter')} />
        <Tile.Item.Description>{nasha.localeDatacenter}</Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:information.disk_type')} />
        <Tile.Item.Description>{nasha.diskType}</Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:information.disk_size')} />
        <Tile.Item.Description>{nasha.diskSize}</Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
}
