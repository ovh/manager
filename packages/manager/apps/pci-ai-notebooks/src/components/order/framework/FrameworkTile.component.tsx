import { useEffect, useState } from 'react';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import * as ai from '@/types/cloud/project/ai';
import VersionSelector from './FrameworkTileVersion.component';

export const FrameworkTile = ({
  framework,
  version,
  selected,
  onChange,
}: {
  framework: ai.capabilities.notebook.Framework;
  version: string;
  selected: boolean;
  onChange: (
    framework: ai.capabilities.notebook.Framework,
    version: string,
  ) => void;
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>(version);
  const handleFrameworkClick = () => {
    onChange(framework, selectedVersion);
  };
  useEffect(() => {
    onChange(framework, selectedVersion);
  }, [selectedVersion]);
  return (
    <RadioTile
      name="framework-select"
      onChange={handleFrameworkClick}
      value={framework.name}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <h5
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            {framework.name}
          </h5>
        </div>
        {framework.logoUrl && (
          <img
            className="block w-[50px] h-[50px]"
            src={framework.logoUrl}
            alt={framework.name}
          />
        )}
      </div>
      <RadioTile.Separator />
      <VersionSelector
        versions={framework.versions}
        selectedVersion={selectedVersion}
        isFrameworkSelected={selected}
        onChange={(versionName) => {
          setSelectedVersion(framework.versions.find((v) => v === versionName));
        }}
      />
      <RadioTile.Separator />
      <p className="text-xs text-justify leading-relaxed">
        {framework.description}
      </p>
    </RadioTile>
  );
};

export default FrameworkTile;
