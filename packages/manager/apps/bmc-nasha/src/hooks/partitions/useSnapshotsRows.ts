import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

type SnapshotRow = {
  type: string;
  name: string;
  isCustom: boolean;
};

type UseSnapshotsRowsProps = {
  snapshotTypes?: string[];
  customSnapshots?: string[];
};

export function useSnapshotsRows({ snapshotTypes, customSnapshots }: UseSnapshotsRowsProps) {
  const { t } = useTranslation(['partition']);

  return useMemo<SnapshotRow[]>(() => {
    const rows: SnapshotRow[] = [];

    // Add snapshot types row
    if (snapshotTypes && snapshotTypes.length > 0) {
      rows.push({
        type: t('partition:snapshots.types', 'Snapshot types'),
        name: snapshotTypes.join(', ') || t('partition:snapshots.no_types', 'None'),
        isCustom: false,
      });
    }

    // Add custom snapshots rows
    if (customSnapshots) {
      customSnapshots.forEach((snapshot) => {
        rows.push({
          type: t('partition:snapshots.custom', 'Custom snapshot'),
          name: snapshot,
          isCustom: true,
        });
      });
    }

    return rows;
  }, [snapshotTypes, customSnapshots, t]);
}
