import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { database } from '@/models/database';
import { Input } from '@/components/ui/input';
import { H4 } from '@/components/typography';

interface NodesConfigProps {
  availability: database.Availability;
}
const NodesConfig = ({ availability }: NodesConfigProps) => {
  const [nbNodes, setNbNodes] = useState(availability.minNodeNumber);
  const { minNodeNumber, maxNodeNumber } = availability;
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
