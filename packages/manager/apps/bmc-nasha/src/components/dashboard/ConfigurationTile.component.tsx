import { useTranslation } from 'react-i18next';

import {
  Button,
  Icon,
  Meter,
  Text,
  Tile,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovh-ux/muk';

type Usage = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

type ConfigurationTileProps = {
  usage?: Usage;
  spaceLeftDisplay: {
    used: { value: number; unit: string };
    total: { value: number; unit: string };
    ratio: number;
  } | null;
  usagePercentage: number;
  canCreatePartitions: boolean;
  onCreatePartition: () => void;
};

export default function ConfigurationTile({
  usage,
  spaceLeftDisplay,
  usagePercentage,
  canCreatePartitions,
  onCreatePartition,
}: ConfigurationTileProps) {
  const { t } = useTranslation(['dashboard']);

  return (
    <Tile.Root title={t('dashboard:configuration.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard:configuration.quota')} />
        <Tile.Item.Description>
          <div className="space-y-4">
            {/* Space Left Display (like original) */}
            {spaceLeftDisplay && (
              <div className="mb-4 flex items-center gap-2">
                <Text preset="paragraph" className="text-sm font-semibold">
                  {spaceLeftDisplay.used.value} {spaceLeftDisplay.used.unit} /{' '}
                  {spaceLeftDisplay.total.value} {spaceLeftDisplay.total.unit} (
                  {spaceLeftDisplay.ratio}%)
                </Text>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon
                      name="circle-question"
                      className="ml-2 cursor-help"
                      aria-label={t('dashboard:configuration.quota_help', 'Help')}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset="paragraph">
                      {t(
                        'dashboard:configuration.quota_help_text',
                        'The total capacity displayed corresponds to your HA-NAS volume — 20% more storage is added to it for your snapshots.',
                      )}
                    </Text>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Meter */}
            {usage && (
              <div className="w-full">
                <Meter value={usagePercentage} min={0} max={100} low={40} high={80} optimum={30} />
              </div>
            )}

            {/* Create partition link */}
            <Button
              variant="outline"
              size="md"
              onClick={onCreatePartition}
              disabled={!canCreatePartitions}
              className="mt-4"
            >
              <span className="flex items-center">
                {t('dashboard:configuration.link')}
                <Icon name="arrow-right" className="ml-2" />
              </span>
            </Button>
          </div>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
}
