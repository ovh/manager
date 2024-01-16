import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { H4 } from '@/components/typography';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';

interface NodesConfigProps {
  model: AvailabilitiesHookOutput;
}
const NodesConfig = ({ model }: NodesConfigProps) => {
  if (!model.availability) return <></>;
  const [nbNodes, setNbNodes] = useState(model.availability.minNodeNumber);
  const { minNodeNumber, maxNodeNumber } = model.availability;
  if (minNodeNumber === maxNodeNumber) {
    return <></>;
  }
  return (
    <div>
      <H4>Nombre de noeuds</H4>
      <Label htmlFor="node-number-select">
        Sélectionnez le nombre de nœuds du cluster
      </Label>
      <Input
        name="node-number-select"
        type="number"
        min={minNodeNumber}
        max={maxNodeNumber}
        value={nbNodes}
        onChange={(e) => setNbNodes(+e.target.value)}
      />
    </div>
  );
};

export default NodesConfig;
