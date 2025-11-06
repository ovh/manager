import { useMemo } from 'react';

import { Progress } from '@ovh-ux/muk';

import type { SpaceMeterProps } from '@/types/SpaceMeter.type';

export function SpaceMeter({
  usage,
  legend = false,
  large = false,
  help,
}: SpaceMeterProps) {
  const maxSize = useMemo(() => {
    if (!usage?.size?.value) {
      return null;
    }
    return parseInt(String(usage.size.value), 10);
  }, [usage]);

  const legendItems = useMemo(() => {
    return Object.keys(usage)
      .filter((type) => type !== 'size')
      .map((type) => ({
        type,
        name: usage[type].name,
        value: usage[type].value,
        unit: usage[type].unit,
      }));
  }, [usage]);

  const usedValue = useMemo(() => {
    if (!usage?.used?.value) {
      return 0;
    }
    return usage.used.value;
  }, [usage]);

  if (!maxSize) {
    return null;
  }

  return (
    <div className="space-meter">
      <div className={`row ${legend ? 'mb-3' : ''}`}>
        <div className={legend ? 'col-sm-6' : 'col-sm-12'}>
          <div className="d-flex align-items-center mb-2">
            <span className="text-sm">
              {usedValue} {usage.used?.unit} / {usage.size.value}{' '}
              {usage.size.unit} (
              {((usedValue / maxSize) * 100).toFixed(2)}%)
            </span>
            {help && (
              <button
                type="button"
                className="btn btn-icon ml-2"
                data-oui-popover={help}
                data-oui-popover-placement="top"
              >
                <span className="oui-icon oui-icon-question-circle" />
              </button>
            )}
          </div>
        </div>
        {legend && (
          <div className="col-sm-6">
            <ul className="list-unstyled mb-0">
              {legendItems.map((item) => (
                <li key={item.type} className="d-flex align-items-center mb-1">
                  <span className="text-sm">
                    <strong>{item.name}:</strong> {item.value} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={`row ${large ? 'col-sm-12' : 'col-sm-12 col-md-8'}`}>
        <Progress
          value={(usedValue / maxSize) * 100}
          max={100}
          className="w-100"
        />
      </div>
    </div>
  );
}

