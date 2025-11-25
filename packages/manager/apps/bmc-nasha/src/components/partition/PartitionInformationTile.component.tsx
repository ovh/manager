import { useTranslation } from 'react-i18next';

import { Button, Icon, Tile } from '@ovh-ux/muk';

import SpaceMeter from '@/components/space-meter/SpaceMeter.component';

type PartitionUse = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

type PartitionInformationTileProps = {
  partition: {
    partitionName: string;
    partitionDescription?: string;
    protocol?: string;
    use?: PartitionUse;
  };
  onEditDescription: () => void;
  onEditSize: () => void;
};

export function PartitionInformationTile({
  partition,
  onEditDescription,
  onEditSize,
}: PartitionInformationTileProps) {
  const { t } = useTranslation(['partition']);

  return (
    <Tile.Root title={t('partition:information.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('partition:information.name')} />
        <Tile.Item.Description>{partition.partitionName}</Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('partition:information.description')} />
        <Tile.Item.Description>
          <div className="flex items-center">
            <span>
              {partition.partitionDescription || (
                <em>{t('partition:information.description_none', 'No description')}</em>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditDescription}
              className="ml-2"
              aria-label={t('partition:edit', 'Edit')}
            >
              <Icon name="pen" />
            </Button>
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('partition:information.protocol')} />
        <Tile.Item.Description>{partition.protocol || '-'}</Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('partition:information.size')} />
        <Tile.Item.Description>
          {partition.use?.size ? (
            <div className="flex items-center">
              <span>
                {partition.use.size.value} {partition.use.size.unit}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditSize}
                className="ml-2"
                aria-label={t('partition:edit', 'Edit')}
              >
                <Icon name="pen" />
              </Button>
            </div>
          ) : (
            '-'
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('partition:information.quota')} />
        <Tile.Item.Description>
          {partition.use ? <SpaceMeter usage={partition.use} large /> : '-'}
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
}
