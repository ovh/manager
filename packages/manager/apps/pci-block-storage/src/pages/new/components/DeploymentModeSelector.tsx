import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import { TCatalogGroup } from '@/api/data/catalog';
import { DeploymentModeTile } from '@/pages/new/components/DeploymentModeTile';

interface DeploymentModeSelectorProps {
  deploymentGroups: TCatalogGroup[];
  selectedRegionGroup?: TCatalogGroup | null;
  onChange?: (group: TCatalogGroup) => void;
}

export const DeploymentModeSelector = ({
  deploymentGroups,
  selectedRegionGroup,
  onChange,
}: DeploymentModeSelectorProps) => (
  <div>
    <TilesInputComponent<TCatalogGroup>
      items={deploymentGroups}
      value={selectedRegionGroup}
      onInput={onChange}
      label={(group) => (
        <DeploymentModeTile
          group={group}
          selected={selectedRegionGroup === group}
        />
      )}
    />
  </div>
);
