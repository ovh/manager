import { ai } from '@/models/types';
import FlavorTile from './flavor-tile';

interface FlavorSelectProps {
  selectedFlavor: ai.capabilities.Flavor;
  selectedResource: number;
  listFlavors: ai.capabilities.Flavor[];
  onChange: ({
    flavor,
  }: {
    flavor: ai.capabilities.Flavor;
  }) => void;
}

const FlavorSelect = ({
  selectedFlavor,
  selectedResource,
  listFlavors,
  onChange,
}: FlavorSelectProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
        {listFlavors.map((flav) => (
          <FlavorTile
            key={flav.id}
            flavor={flav}
            selectedResource={selectedResource}
            selected={flav === selectedFlavor}
            onChange={(f) => {
              onChange({ flavor: f});
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FlavorSelect;