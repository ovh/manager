import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Icon,
  ICON_NAME,
  ProgressBar,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import type { NashaUse } from '@/types/nasha.type';

interface SpaceMeterProps {
  usage: NashaUse;
  legend?: boolean;
  large?: boolean;
  showHelp?: boolean;
}

// Colors for different usage types (match Angular legacy palette)
const USAGE_COLORS: Record<string, string> = {
  used: '#64afa0',
  usedbysnapshots: '#ffcd00',
};

export const SpaceMeter: React.FC<SpaceMeterProps> = ({
  usage,
  legend = false,
  large = false,
  showHelp = true,
}) => {
  const { t } = useTranslation(['components', 'common']);

  const getLegacyLegendIconText = (type: string) => {
    // Angular: used -> harddisk, usedbysnapshots -> serverSave
    return type === 'usedbysnapshots' ? 'serverSave' : 'harddisk';
  };

  const formatNumber = (value: number) => {
    // Angular uses `toFixed(2)` for ratio and displays values already pre-formatted;
    // we keep a stable 2-decimal output for consistency.
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  };

  const maxSize = useMemo(() => {
    const raw = usage?.size?.value;
    if (raw === null || raw === undefined) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [usage]);

  const usedSize = useMemo(() => {
    const raw = usage?.used?.value;
    if (raw === null || raw === undefined) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [usage]);

  const usageItems = useMemo(() => {
    return Object.entries(usage)
      .filter(([type]) => type !== 'size')
      .map(([type, data]) => ({
        type,
        value: data.value,
    // Align with Angular: names come from translation keys, not raw type.
    name: t(`common:nasha_use_type_${type}`, { defaultValue: data.name || type }),
        unit: data.unit,
        color: USAGE_COLORS[type] || 'var(--ods-color-neutral-500)',
      }));
  }, [t, usage]);

  const freeSpace = useMemo(() => {
    if (maxSize === null || usedSize === null) return 0;
    return Math.max(maxSize - usedSize, 0);
  }, [maxSize, usedSize]);

  // Angular ratio is (used / size) * 100 with 2 decimals.
  const ratioUsed = useMemo(() => {
    if (maxSize === null || usedSize === null || maxSize === 0) return 0;
    return (usedSize * 100) / maxSize;
  }, [usedSize, maxSize]);

  const tooltipContent = useMemo(() => {
    // Angular tooltip renders the same "used / total (ratio)" plus a legend breakdown.
    const snapshotItem = usageItems.find((i) => i.type === 'usedbysnapshots');
    const usedItem = usageItems.find((i) => i.type === 'used');

    const formatLineValue = (v: unknown) => formatNumber(Number(v ?? 0));

    return (
      <div className="flex flex-col gap-4">
        <Text preset={TEXT_PRESET.paragraph} className="font-semibold text-[1.25rem] leading-snug">
          {formatNumber(usedSize ?? 0)} {usage.size?.unit} / {maxSize ?? 0}{' '}
          {usage.size?.unit} ({formatNumber(ratioUsed)}%)
        </Text>

        {/* Angular tooltip includes a column legend */}
        <ul className="list-none p-0 m-0">
          {usedItem && (
            <li className="relative pl-8 pr-0 py-1 text-[0.95rem] text-[#4a4a4a]">
              <span
                className="absolute left-0 top-0 h-full w-[0.4375rem] bg-[#64afa0]"
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-1">
                <span className="text-[#7d7d7d] inline-flex items-center justify-center h-7 w-7 rounded border border-[#d9d9d9] bg-white">
                  <span className="ovh-font ovh-font-harddisk" aria-hidden="true" />
                </span>
                <span>{usedItem.name}</span>
              </span>
              <span className="float-right">
                {formatLineValue(usedItem.value)} {usedItem.unit}
              </span>
            </li>
          )}

          {snapshotItem && (
            <li className="relative pl-8 pr-0 py-1 text-[0.95rem] text-[#4a4a4a]">
              <span
                className="absolute left-0 top-0 h-full w-[0.4375rem] bg-[#ffcd00]"
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-1">
                <span className="text-[#7d7d7d] inline-flex items-center justify-center h-7 w-7 rounded border border-[#d9d9d9] bg-white">
                  <span className="ovh-font ovh-font-serverSave" aria-hidden="true" />
                </span>
                <span>{snapshotItem.name}</span>
              </span>
              <span className="float-right">
                {formatLineValue(snapshotItem.value)} {snapshotItem.unit}
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  }, [freeSpace, maxSize, ratioUsed, t, usage.size?.unit, usageItems, usedSize]);

  if (!usage || maxSize === null || usedSize === null) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Used info (Angular shows used / total (ratio) and opens a tooltip on hover) */}
  <div className="flex items-center gap-2 mb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`inline font-semibold text-[#4a5bd5] ${
                large ? 'text-[1.25rem]' : 'text-[1.125rem]'
              } leading-none underline decoration-dotted decoration-[#7d7d7d] underline-offset-[6px] hover:cursor-pointer focus:outline-none focus-visible:outline-none`}
            >
              {formatNumber(usedSize)} {usage.size?.unit} / {maxSize} {usage.size?.unit} ({formatNumber(ratioUsed)}%)
            </a>
          </TooltipTrigger>
          <TooltipContent className="w-[22rem] rounded-2xl border border-[#eee] bg-white p-5 shadow-[0_2px_5px_0_rgba(219,220,229,0.5)]">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>

        {showHelp && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon name={ICON_NAME.circleQuestion} className="text-[#4a5bd5] cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              {t('nasha_components_space_meter_space_left_help')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={ratioUsed}
        max={100}
  className="mb-2"
        style={{ ['--ods-color-primary-500' as any]: USAGE_COLORS.used }}
      />

      {/* Legend */}
      {legend && (
        <ul className="mt-3 list-none p-0 m-0 w-full">
          {usageItems.map((item) => {
            const swatchClass =
              item.type === 'used'
                ? "bg-[#64afa0] bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)_40%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%)] bg-[length:8px_8px] bg-[-1.25rem_0]"
                : item.type === 'usedbysnapshots'
                ? 'bg-[#ffcd00]'
                : '';

            return (
              <li
                key={item.type}
                className="flex items-center justify-between gap-4 text-left mb-2"
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-block h-4 w-[0.4375rem] ${swatchClass}`}
                    aria-hidden="true"
                  />
                  <Text preset={TEXT_PRESET.caption} className="truncate">
                    {item.name}
                  </Text>
                </span>
                <Text preset={TEXT_PRESET.caption} className="shrink-0">
                  {item.value} {item.unit}
                </Text>
              </li>
            );
          })}

          <li className="flex items-center justify-between gap-4 text-left">
            <span className="inline-flex items-center gap-2 min-w-0">
              <span
                className="inline-block h-4 w-2 bg-[var(--ods-color-neutral-200)]"
                aria-hidden="true"
              />
              <Text preset={TEXT_PRESET.caption} className="truncate">
                {t('nasha_components_space_meter_free')}
              </Text>
            </span>
            <Text preset={TEXT_PRESET.caption} className="shrink-0">
              {formatNumber(freeSpace)} {usage.size?.unit}
            </Text>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SpaceMeter;
