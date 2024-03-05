import RadioTile from '@/components/radio-tile';
import { H5, P } from '@/components/typography';
import { ai } from '@/models/types';
import { useEffect, useState } from 'react';
//import { useTranslation } from 'react-i18next';
import VersionSelector from './framework-tile.version';

export const FrameworkTile = ({
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
  //const { t } = useTranslation('pci-databases-analytics/components/engine');
  const [selectedVersion, setSelectedVersion] = useState(version);
  const handleFrameworkClick = () => {
    onChange(framework, selectedVersion);
  };
  useEffect(() => {
    onChange(framework, selectedVersion);
  }, [selectedVersion]);
  return (
    <RadioTile
      name="engine-select"
      onChange={handleFrameworkClick}
      value={framework.id}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <H5
            className={`capitalize ${selected ? 'font-bold' : 'font-normal'}`}
          >
            {framework.name}
          </H5>
        </div>
        {framework.logoUrl && (
          <img
            className="block w-[40px] h-[40px]"
            src={framework.logoUrl}
            alt={framework.name}
          />
        )}
      </div>
      <P className="text-sm">
        {/** 
        {t(`description-${engine.name}`, engine.description)}
         */}
        {framework.description}
      </P>
      <RadioTile.Separator />
      <VersionSelector
        versions={framework.versions}
        selectedVersion={selectedVersion}
        isFrameworkSelected={selected}
        onChange={setSelectedVersion}
      />
    </RadioTile>
  );
};

export default FrameworkTile;
