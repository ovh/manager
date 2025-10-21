import React from 'react';
import { clsx } from 'clsx';
import type { StorageProgressBarProps } from './SpaceMeter.types';

export const StorageProgressBar = ({
  totalSize,
  used,
  usedBySnapshots,
  large = false
}: StorageProgressBarProps) => {
  const usedPercent = totalSize > 0 ? (used / totalSize) * 100 : 0;
  const snapshotsPercent = totalSize > 0 ? (usedBySnapshots / totalSize) * 100 : 0;

  return (
    <div
      className={clsx(
        "w-full bg-white border border-gray-300 rounded overflow-hidden",
        large ? "h-[18px]" : "h-[12px]"
      )}
    >
      <div className="h-full flex">
        {/* Segment données (vert avec rayures) */}
        {usedPercent > 0 && (
          <div
            className="relative bg-[#64afa0] stripe-pattern-green"
            style={{ width: `${usedPercent}%` }}
            data-testid="storage-bar-used"
          />
        )}

        {/* Segment snapshots (jaune) */}
        {snapshotsPercent > 0 && (
          <div
            className="bg-[#ffcd00]"
            style={{ width: `${snapshotsPercent}%` }}
            data-testid="storage-bar-snapshots"
          />
        )}
      </div>
    </div>
  );
};
