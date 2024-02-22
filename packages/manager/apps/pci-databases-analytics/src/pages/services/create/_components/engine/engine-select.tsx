import { Engine, EngineWithVersion, Version } from '@/models/order-funnel';
import EngineTile from './engine-tile';

interface EngineSelectProps {
  engines: Engine[];
  value: EngineWithVersion;
  onChange: (newEngineWithVersion: EngineWithVersion) => void;
}

const EnginesSelect = ({ engines, value, onChange }: EngineSelectProps) => {
  return (
    <div className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {engines
        .sort((a, b) => a.order - b.order)
        .map((engine) => (
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
};

export default EnginesSelect;
