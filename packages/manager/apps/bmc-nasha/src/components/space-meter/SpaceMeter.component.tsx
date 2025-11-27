import { memo, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovh-ux/muk';

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
 * SpaceMeter component that reproduces the original nasha-components-space-meter
 * Displays storage usage with multiple progress bars (one per usage type)
 */
function SpaceMeter({ usage, large = false, legend = false }: SpaceMeterProps) {
  const { t } = useTranslation(['dashboard', 'common']);

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
        unit: data.unit,
        name: data.name || type,
      }));
  }, [usage]);

  const totalUsed = useMemo(() => {
    return usageItems.reduce((sum, item) => sum + item.value, 0);
  }, [usageItems]);

  // Calculate space left (like the original filter)
  // The original uses usage.used, not totalUsed
  const spaceLeft = useMemo(() => {
    if (!usage.size || !usage.used || maxSize === 0) return null;
    const used = usage.used.value;
    const total = maxSize;
    const ratio = total > 0 ? ((used / total) * 100).toFixed(2) : '0.00';

    return {
      used: { value: used, unit: usage.used.unit },
      total: { value: total, unit: usage.size.unit },
      ratio: parseFloat(ratio),
    };
  }, [usage.size, usage.used, maxSize]);

  // Get color for each usage type
  const getColorForType = (type: string) => {
    switch (type) {
      case 'usedbysnapshots':
        return '#ffcd00'; // Yellow
      case 'used':
      default:
        return '#64afa0'; // Teal
    }
  };

  if (!usage.size || maxSize === 0) {
    return <div className="text-sm text-gray-500">No usage data available</div>;
  }

  return (
    <div className="space-meter">
      {/* Space Left Display */}
      {spaceLeft && (
        <div className="mb-4">
          <Text preset="paragraph" className={`text-sm ${large ? 'font-semibold' : ''}`}>
            {spaceLeft.used.value} {spaceLeft.used.unit} / {spaceLeft.total.value}{' '}
            {spaceLeft.total.unit} ({spaceLeft.ratio}%)
          </Text>
        </div>
      )}

      {/* Legend and Progress Bars Layout */}
      <div className={legend ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : ''}>
        {/* Legend */}
        {legend && usageItems.length > 0 && (
          <div>
            <Text preset="paragraph" className="mb-2 text-sm font-semibold">
              {t('dashboard:configuration.usage', 'Usage')}
            </Text>
            <ul className="space-y-1">
              {usageItems.map((item) => (
                <li key={item.type} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block size-3 rounded"
                      style={{ backgroundColor: getColorForType(item.type) }}
                    />
                    <span>{item.name}:</span>
                  </span>
                  <span>
                    {item.value} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Bars Container - Single bar with multiple segments (like oui-progress) */}
        <div className={legend ? '' : 'w-full'}>
          <div
            className="relative overflow-hidden rounded"
            style={{
              height: large ? '1.125rem' : '0.75rem',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              padding: '1px',
            }}
          >
            {usageItems.map((item, index) => {
              const previousValue = usageItems
                .slice(0, index)
                .reduce((sum, prevItem) => sum + prevItem.value, 0);
              const percentage = maxSize > 0 ? (item.value / maxSize) * 100 : 0;
              const previousPercentage = maxSize > 0 ? (previousValue / maxSize) * 100 : 0;

              return (
                <div
                  key={item.type}
                  className="absolute inset-y-0"
                  style={{
                    left: `${previousPercentage}%`,
                    width: `${percentage}%`,
                    backgroundColor: getColorForType(item.type),
                    position: 'relative',
                  }}
                >
                  {item.type === 'used' && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2) 40%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%)`,
                        backgroundSize: '8px 8px',
                        backgroundPosition: '-1.25rem 0',
                        zIndex: 1,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(SpaceMeter);
