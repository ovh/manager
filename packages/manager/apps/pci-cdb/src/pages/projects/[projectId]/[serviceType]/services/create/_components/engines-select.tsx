interface EngineSelectProps {
  selectedEngine: string;
  listEngines: string[];
  onChangeEngine: (newEngine: string) => void;
  selectedVersion: string;
  listVersions: string[];
  onChangeVersion: (newVersion: string) => void;
}

const EngineSelect = ({
  selectedEngine,
  listEngines,
  onChangeEngine,
  selectedVersion,
  listVersions,
  onChangeVersion,
}: EngineSelectProps) => {
  return (
    <div>
      <div className="flex items-center mb-2">
        <label className="mr-2">Engine:</label>
        <select
          className="inline-flex items-center whitespace-nowrap rounded-l-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between border-r-0"
          value={selectedEngine}
          onChange={(e) => onChangeEngine(e.target.value)}
        >
          {/* Populate options based on available engines */}
          {listEngines.map((engine, index) => (
            <option key={index} value={engine}>
              {engine}
            </option>
          ))}
        </select>
        <select
          className="inline-flex items-center whitespace-nowrap rounded-r-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
          value={selectedVersion}
          onChange={(e) => onChangeVersion(e.target.value)}
        >
          {/* Populate options based on available engines */}
          {listVersions.map((version, index) => (
            <option key={index} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EngineSelect;
