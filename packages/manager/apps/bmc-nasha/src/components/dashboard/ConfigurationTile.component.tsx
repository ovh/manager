import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Icon, Tile } from '@ovh-ux/muk';

import { SpaceMeter } from '@/components/space-meter/SpaceMeter.component';
import { goToPartitionsCreate } from '@/utils/dashboard/navigation.utils';
import type { Nasha } from '@/types/Dashboard.type';

type ConfigurationTileProps = {
  nasha: Nasha;
  canCreatePartitions: boolean;
  serviceName: string;
};

export function ConfigurationTile({
  nasha,
  canCreatePartitions,
  serviceName,
}: ConfigurationTileProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const handleCreatePartition = () => {
    goToPartitionsCreate(serviceName, navigate);
  };

  return (
    <Tile.Root title={t('configuration.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('configuration.quota')} />
        <Tile.Item.Description divider={false}>
          <SpaceMeter usage={nasha.use} legend large />
        </Tile.Item.Description>
        <Tile.Item.Description>
          <Button
            variant="link"
            size="m"
            disabled={!canCreatePartitions}
            onClick={handleCreatePartition}
            className="mt-2"
          >
            {t('configuration.link')}
            <Icon name="arrow-right" className="ml-1" />
          </Button>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
}

