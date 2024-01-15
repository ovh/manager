import { useEffect, useState } from 'react';
import { Engine, Version } from '@/models/dto/OrderFunnel';
import RadioTile from '@/components/radio-tile';
import VersionSelector from './engine-tile-version';

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
      <p className="text-sm ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod libero sit
        possimus.
      </p>
      <RadioTile.Separator />
      <VersionSelector
        versions={engine.versions}
        selectedVersion={selectedVersion}
        onChange={setSelectedVersion}
      />
    </RadioTile>
  );
};

export default EngineTile;
