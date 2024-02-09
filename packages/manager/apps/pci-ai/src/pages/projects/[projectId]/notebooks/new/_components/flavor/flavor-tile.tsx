import RadioTile from '@/components/radio-tile';
import { ai } from '@/models/types';
import { displaySizeFormat } from '@/data/constant';

const FlavorTile = ({
  flavor,
  selected,
  selectedResource,
  onChange,
}: {
  flavor: ai.capabilities.Flavor;
  selected: boolean;
  selectedResource: number;
  onChange: (flavor: ai.capabilities.Flavor) => void;
}) => {
  const handleFlavorClick = () => {
    onChange(flavor);
  };

  return (
    <RadioTile
      name="flavor-select"
      onChange={handleFlavorClick}
      value={flavor.id}
      checked={selected}
    >
      <div className="flex justify-between items-center">
        <h3 className="capitalize font-bold">
          {flavor.id}
        </h3>
      </div>

      {flavor.type === ai.capabilities.FlavorTypeEnum.gpu ? (
        <div>
          <p>{selectedResource} x {flavor.description}</p>
          <p>{selectedResource} x {displaySizeFormat(flavor.gpuInformation?.gpuMemory, false, 0)} RAM</p>
        </div>
      ) : (
        <p>Model: {flavor.description}</p>
      )}
      <RadioTile.Separator />
      <div className="text-xs">
        <p>CPU: {selectedResource * flavor.resourcesPerUnit.cpu} vCores</p>
        <p>RAM: {displaySizeFormat(selectedResource * Number(flavor.resourcesPerUnit.memory), false, 0)}</p>
        <p>Temporary local storage: {displaySizeFormat(selectedResource * flavor.resourcesPerUnit.ephemeralStorage, false, 0)} SSD</p>
        <p>Public Network: {displaySizeFormat(selectedResource * flavor.resourcesPerUnit.publicNetwork, true, 2)}/s</p>
        <RadioTile.Separator />
        <p className="text-xs">
          Ressource Price <strong>1.93 ex. VAT/hour</strong>
        </p>
      </div>
    </RadioTile>
  );
};

export default FlavorTile;
