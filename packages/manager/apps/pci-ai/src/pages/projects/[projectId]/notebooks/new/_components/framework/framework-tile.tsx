import { useEffect, useState } from 'react';
import RadioTile from '@/components/radio-tile';
import VersionSelector from './framework-tile-version';
import { ai } from '@/models/types';

const FrameworkTile = ({
  framework,
  version,
  selected,
  onChange,
}: {
  framework: ai.notebook.Framework;
  version: string;
  selected: boolean;
  onChange: (framework: ai.notebook.Framework, version: string) => void;
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>(version);
  const handleFramworkClick = () => {
    onChange(framework, selectedVersion);
  };
  useEffect(() => {
    onChange(framework, selectedVersion);
  }, [selectedVersion]);

  return (
    <RadioTile
      name="framework-select"
      onChange={handleFramworkClick}
      value={framework.name}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <h3 className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}>
          {framework.name}
        </h3>
        {framework.logoUrl && <img className="block w-[40px] h-[40px]" src={framework.logoUrl} />}
      </div>
      <RadioTile.Separator />
      <VersionSelector
        versions={framework.versions}
        selectedVersion={selectedVersion}
        isFrameworkSelected={selected}
        onChange={setSelectedVersion}
      />
      <RadioTile.Separator />
      <p className="text-sm ">{framework.description}</p>
    </RadioTile>
  );
};

export default FrameworkTile;
