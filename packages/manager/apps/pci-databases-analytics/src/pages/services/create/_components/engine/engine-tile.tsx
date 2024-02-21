import { useEffect, useState } from 'react';
import RadioTile from '@/components/radio-tile';
import VersionSelector from './engine-tile-version';
import { Engine, Version } from '@/models/order-funnel';

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
  const [selectedVersion, setSelectedVersion] = useState<Version>(version);
  const handleEngineClick = () => {
    onChange(engine, selectedVersion);
  };
  useEffect(() => {
    onChange(engine, selectedVersion);
  }, [selectedVersion]);

  return (
    <RadioTile
      name="engine-select"
      onChange={handleEngineClick}
      value={engine.name}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <h3 className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}>
          {engine.name}
        </h3>
        <img
          className="block w-[60px] h-[40px]"
          src={`./assets/engines/${engine.name}.png`}
        />
      </div>
      <p className="text-sm">{engine.description}</p>
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
