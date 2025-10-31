import { useMemo } from 'react';
import { Progress } from '@ovhcloud/ods-react';
import type { NashaPrepared } from '@/types/Dashboard.type';

type SpaceMeterProps = {
  usage: NashaPrepared['use'];
  large?: boolean;
  legend?: boolean;
};

const getMaxSize = (usage: NashaPrepared['use']): number => {
  return usage?.size?.value || 0;
};

const getUsedValue = (usage: NashaPrepared['use']): number => {
  return usage?.used?.value || 0;
};

export function SpaceMeter({ usage, large = false, legend = false }: SpaceMeterProps) {
  const maxSize = useMemo(() => getMaxSize(usage), [usage]);
  const usedValue = useMemo(() => getUsedValue(usage), [usage]);
  const percentage = useMemo(() => (maxSize > 0 ? (usedValue / maxSize) * 100 : 0), [maxSize, usedValue]);

  const usageParts = useMemo(() => {
    if (!usage) return [];
    return Object.entries(usage)
      .filter(([type]) => type !== 'size' && type !== 'used')
      .map(([type, part]) => ({
        type,
        name: part.name || type,
        value: part.value || 0,
        unit: part.unit || '',
      }));
  }, [usage]);

  if (!usage || !usage.size) {
    return null;
  }

  // Calculate cumulative values for stacked progress bars
  let cumulativeValue = 0;

  return (
    <div className="space-meter">
      <div className={legend ? 'grid grid-cols-2 gap-4 mb-4' : 'w-full mb-4'}>
        <div className={large ? 'col-span-2' : legend ? 'col-span-1' : 'w-full'}>
          <div className="space-meter__info mb-2">
            <div className="text-sm">
              {usedValue.toFixed(2)} {usage.used?.unit} / {maxSize.toFixed(2)} {usage.size?.unit} (
              {percentage.toFixed(2)}%)
            </div>
          </div>
          <div className={large ? 'w-full' : 'w-full md:w-2/3'}>
            <Progress value={maxSize} max={maxSize}>
              {usageParts.length > 0 && (
                <Progress.Bar
                  value={usedValue}
                  max={maxSize}
                  className="progress-bar--used"
                  style={{
                    backgroundColor: '#64afa0',
                    backgroundImage: `repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2) 40%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%)`,
                    backgroundSize: '8px 8px',
                  }}
                />
              )}
              {usageParts
                .filter((part) => part.type === 'usedbysnapshots')
                .map((part) => {
                  cumulativeValue += part.value;
                  return (
                    <Progress.Bar
                      key={part.type}
                      value={part.value}
                      max={maxSize}
                      className="progress-bar--usedbysnapshots"
                      style={{
                        backgroundColor: '#ffcd00',
                        marginLeft: `${((cumulativeValue - part.value) / maxSize) * 100}%`,
                      }}
                    />
                  );
                })}
            </Progress>
          </div>
        </div>
        {legend && usageParts.length > 0 && (
          <div className="col-span-1">
            <div className="space-meter__legend">
              <ul className="list-none space-y-2">
                {usageParts.map((part) => (
                  <li key={part.type} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${
                        part.type === 'usedbysnapshots' ? 'bg-[#ffcd00]' : 'bg-[#64afa0]'
                      }`}
                    />
                    <span className="text-sm">
                      {part.name}: {part.value.toFixed(2)} {part.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
