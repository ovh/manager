import { useMemo } from 'react';

type Usage = {
  [key: string]: {
    unit: string;
    value: number;
    name?: string;
  };
};

type SpaceMeterProps = {
  usage: Usage;
  large?: boolean;
  legend?: boolean;
};

/**
 * Simplified SpaceMeter component
 * Displays storage usage with a progress bar
 * TODO: Implement full space-meter with legend when needed
 */
export default function SpaceMeter({ usage, large = false, legend = false }: SpaceMeterProps) {
  const maxSize = useMemo(() => {
    const size = usage.size;
    return size ? parseInt(String(size.value), 10) : 0;
  }, [usage]);

  const usageItems = useMemo(() => {
    return Object.entries(usage)
      .filter(([key]) => key !== 'size')
      .map(([type, data]) => ({
        type,
        value: data.value,
        name: data.name || type,
      }));
  }, [usage]);

  const totalUsed = useMemo(() => {
    return usageItems.reduce((sum, item) => sum + item.value, 0);
  }, [usageItems]);

  return (
    <div className="space-meter">
      {legend && (
        <div className="mb-4">
          <div className="text-sm font-semibold mb-2">Utilisation</div>
          <div className="space-y-1">
            {usageItems.map((item) => (
              <div key={item.type} className="flex justify-between text-sm">
                <span>{item.name}:</span>
                <span>
                  {item.value} {usage[item.type]?.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-full">
        <div className="flex justify-between text-sm mb-2">
          <span>Utilisé: {totalUsed} {usage.size?.unit}</span>
          <span>Total: {maxSize} {usage.size?.unit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all"
            style={{ width: `${(totalUsed / maxSize) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}



