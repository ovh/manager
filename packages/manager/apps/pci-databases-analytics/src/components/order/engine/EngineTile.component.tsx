import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import VersionSelector from './EngineTileVersion.component';
import { Engine, Version } from '@/types/orderFunnel';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { getTagVariant } from '@/lib/tagsHelper';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';

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

  return (
    <RadioTile
      data-testid="engine-radio-tile"
      name="engine-select"
      onChange={handleEngineClick}
      value={engine.name}
      checked={selected}
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
      <RadioTile.Separator />
      <VersionSelector
        versions={engine.versions}
        selectedVersion={selectedVersion.name}
        isEngineSelected={selected}
        onChange={(versionName) =>
          setSelectedVersion(
            engine.versions.find((v) => v.name === versionName),
          )
        }
      />
    </RadioTile>
  );
};

export default EngineTile;
