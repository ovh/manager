import React from 'react';
import { Engine, EngineWithVersion, Version } from '@/types/orderFunnel';
import EngineTile from './EngineTile.component';

interface EngineSelectProps {
  engines: Engine[];
  value: EngineWithVersion;
  onChange: (newEngineWithVersion: EngineWithVersion) => void;
}

const EnginesSelect = React.forwardRef<HTMLInputElement, EngineSelectProps>(
  ({ engines, value, onChange }, ref) => {
    return (
      <div
        data-testid="engines-select-container"
        ref={ref}
        className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
      >
        {engines.map((engine) => (
          <EngineTile
            key={engine.name}
            engine={engine}
            version={
              engine.name === value.engine
                ? engine.versions.find((v: Version) => v.name === value.version)
                : engine.versions.find(
                    (v: Version) => v.name === engine.defaultVersion,
                  )
            }
            selected={engine.name === value.engine}
            onChange={(newEngine: Engine, newVersion: Version) => {
              onChange({
                engine: newEngine.name,
                version: newVersion.name,
              });
            }}
          />
        ))}
      </div>
    );
  },
);

EnginesSelect.displayName = 'EnginesSelect';

export default EnginesSelect;
