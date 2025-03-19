import { useState } from 'react';
import RadioTile from '@/components/radio-tile/RadioTile.component';
import VersionSelector from './FrameworkTileVersion.component';
import ai from '@/types/AI';

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
  return (
    <RadioTile
      data-testid={`fmk-radio-tile-${framework.id}`}
      name="framework-select"
      onChange={handleFrameworkClick}
      value={framework.name}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span
            className={`capitalize text-lg ${
              selected ? 'font-bold' : 'font-normal'
            }`}
          >
            {framework.name}
          </span>
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
      <p className="text-sm leading-relaxed">{framework.description}</p>
    </RadioTile>
  );
};

export default FrameworkTile;
