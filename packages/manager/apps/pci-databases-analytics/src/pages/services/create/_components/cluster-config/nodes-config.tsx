import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { H4 } from '@/components/typography';

interface NodesConfigProps {
  value: number;
  onChange: (newValue: number) => void;
  minimum: number;
  maximum: number;
}
const NodesConfig = React.forwardRef<HTMLInputElement, NodesConfigProps>(
  ({ value, onChange, minimum, maximum }, ref) => {
    if (minimum === maximum) {
      return <></>;
    }
    return (
      <div>
        <H4>Nombre de noeuds</H4>
        <Label htmlFor="node-number-select">
          Sélectionnez le nombre de nœuds du cluster
        </Label>
        <Input
          ref={ref}
          name="node-number-select"
          type="number"
          min={minimum}
          max={maximum}
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
        />
      </div>
    );
  },
);

NodesConfig.displayName = 'NodesConfig';

export default NodesConfig;
