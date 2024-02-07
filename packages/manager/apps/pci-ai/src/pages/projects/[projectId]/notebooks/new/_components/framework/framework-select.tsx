import { ai } from '@/models/types';
import FrameworkTile from './framework-tile';

interface FrameworkSelectProps {
  selectedFmk: ai.notebook.Framework;
  selectedVersion: string;
  listFrameworks: ai.notebook.Framework[];
  onChange: ({
    framework,
    version,
  }: {
    framework: ai.notebook.Framework;
    version: string;
  }) => void;
}

const FrameworkSelect = ({
  selectedFmk,
  selectedVersion,
  listFrameworks,
  onChange,
}: FrameworkSelectProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {listFrameworks.map((fmk) => (
          <FrameworkTile
            key={fmk.name}
            framework={fmk}
            version={
              fmk === selectedFmk
                ? fmk.versions.find((v) => v === selectedVersion) ??
                  fmk.versions[0]
                : fmk.versions[0]
            }
            selected={fmk === selectedFmk}
            onChange={(f, v) => {
              onChange({ framework: f, version: v });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FrameworkSelect;