import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RadioTile from '@/components/radio-tile';
import VersionSelector from './engine-tile-version';
import { Engine, Version } from '@/models/order-funnel';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { database } from '@/models/database';
import { H5, P } from '@/components/typography';
import { Badge, BadgeProps } from '@/components/ui/badge';

export const EngineTile = ({
  engine,
  version,
  selected,
  onChange,
}: {
  engine: Engine;
  version: Version;
  selected: boolean;
  onChange: (engine: Engine, version: Version) => void;
}) => {
  const { t } = useTranslation('pci-databases-analytics/components/engine');
  const [selectedVersion, setSelectedVersion] = useState<Version>(version);
  const handleEngineClick = () => {
    onChange(engine, selectedVersion);
  };
  useEffect(() => {
    onChange(engine, selectedVersion);
  }, [selectedVersion]);
  const getTagVariant = (tag: string): BadgeProps['variant'] => {
    switch (tag) {
      case 'new':
        return 'success';
      case 'soonDeprecated':
        return 'warning';
      default:
        return 'info';
    }
  };
  return (
    <RadioTile
      name="engine-select"
      onChange={handleEngineClick}
      value={engine.name}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <H5
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            {humanizeEngine(engine.name as database.EngineEnum)}
          </H5>
          <div className="flex gap-1">
            {engine.tags.map((tag) => (
              <Badge
                key={tag}
                variant={getTagVariant(tag)}
                className="text-xs h-4"
              >
                {t(`planTag-${tag}`, tag)}
              </Badge>
            ))}
          </div>
        </div>
        <img
          className="block w-[60px] h-[40px]"
          src={`./assets/engines/${engine.name}.png`}
          alt={engine.name}
        />
      </div>
      <P className="text-sm">
        {t(`description-${engine.name}`, engine.description)}
      </P>
      <RadioTile.Separator />
      <VersionSelector
        versions={engine.versions}
        selectedVersion={selectedVersion}
        isEngineSelected={selected}
        onChange={setSelectedVersion}
      />
    </RadioTile>
  );
};

export default EngineTile;
