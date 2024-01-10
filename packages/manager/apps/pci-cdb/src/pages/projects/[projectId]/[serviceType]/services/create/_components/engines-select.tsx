import { Engine } from '@/models/dto/OrderFunnel';
import EngineTile from './engine-tile';

interface EngineSelectProps {
  selectedEngine: string;
  selectedVersion: string;
  listEngines: Engine[];
  onChange: ({ engine, version }: { engine: string; version: string }) => void;
}

const EngineSelect = ({
  selectedEngine,
  selectedVersion,
  listEngines,
  onChange,
}: EngineSelectProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {listEngines.map((engine) => (
          <EngineTile
            key={engine.name}
            engine={engine}
            version={
              engine.name === selectedEngine
                ? engine.versions.find((v) => v.name === selectedVersion) ??
                  engine.versions[0]
                : engine.versions[0]
            }
            selected={engine.name === selectedEngine}
            onChange={(e, v) => {
              onChange({ engine: e.name, version: v.name });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EngineSelect;
