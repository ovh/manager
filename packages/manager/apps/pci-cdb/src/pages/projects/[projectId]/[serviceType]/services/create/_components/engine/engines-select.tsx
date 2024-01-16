import { Engine, Version } from '@/models/dto/OrderFunnel';
import EngineTile from './engine-tile';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';

interface EngineSelectProps {
  model: AvailabilitiesHookOutput;
}

const EnginesSelect = ({ model }: EngineSelectProps) => {
  return (
    <div className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {model.listEngines.map((engine) => (
        <EngineTile
          key={engine.name}
          engine={engine}
          version={
            engine.name === model.engine.engine
              ? engine.versions.find((v) => v.name === model.engine.version) ??
                engine.versions[0]
              : engine.versions[0]
          }
          selected={engine.name === model.engine.engine}
          onChange={(newEngine: Engine, newVersion: Version) => {
            model.setEngine(() => ({
              engine: newEngine.name,
              version: newVersion.name,
            }));
          }}
        />
      ))}
    </div>
  );
};

export default EnginesSelect;
