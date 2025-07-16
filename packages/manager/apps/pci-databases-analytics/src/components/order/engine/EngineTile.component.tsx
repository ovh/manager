import { useTranslation } from 'react-i18next';
import { Badge, RadioTile } from '@datatr-ux/uxlib';
import { Engine } from '@/types/orderFunnel';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { getTagVariant } from '@/lib/tagsHelper';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';

export const EngineTile = ({ engine }: { engine: Engine }) => {
  const { t } = useTranslation('pci-databases-analytics/components/engine');
  return (
    <RadioTile
      data-testid="engine-radio-tile"
      value={engine.name}
      className="flex flex-col gap-2 p-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <h5 className={'capitalize'}>
            {humanizeEngine(engine.name as database.EngineEnum)}
          </h5>
          <div className="flex gap-1 items-center">
            {engine.tags.map((tag) => (
              <Badge
                data-testid={`Badge${tag}`}
                key={tag}
                variant={getTagVariant(tag)}
                className="text-xs h-4"
              >
                {t(`versionTag-${tag}`, tag)}
              </Badge>
            ))}
          </div>
        </div>
        <EngineIcon
          engine={engine.name as database.EngineEnum}
          category={engine.category}
        />
      </div>
      <p className="text-sm">
        {t(`description-${engine.name}`, engine.description)}
      </p>
    </RadioTile>
  );
};

export default EngineTile;
