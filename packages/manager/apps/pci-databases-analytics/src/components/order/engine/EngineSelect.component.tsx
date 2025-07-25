import React from 'react';
import { RadioGroup } from '@datatr-ux/uxlib';
import { Engine } from '@/types/orderFunnel';
import EngineTile from './EngineTile.component';

interface EngineSelectProps {
  engines: Engine[];
  value: string;
  onChange: (newValue: string) => void;
}

const EnginesSelect = React.forwardRef<HTMLInputElement, EngineSelectProps>(
  ({ engines, value, onChange }, ref) => {
    return (
      <RadioGroup
        data-testid="engines-select-container"
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
        value={value}
        onValueChange={onChange}
      >
        {engines.map((engine) => (
          <EngineTile key={engine.name} engine={engine} />
        ))}
      </RadioGroup>
    );
  },
);

EnginesSelect.displayName = 'EnginesSelect';

export default EnginesSelect;
