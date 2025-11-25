import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import type { SnapshotType, CustomSnapshot } from '@/types/Snapshot.type';

type SnapshotRow = {
  type: string;
  name: string;
  isCustom: boolean;
};

type UseSnapshotsRowsProps = {
  snapshotTypes?: SnapshotType[];
  customSnapshots?: CustomSnapshot[];
};

export function useSnapshotsRows({ snapshotTypes, customSnapshots }: UseSnapshotsRowsProps) {
  const { t } = useTranslation(['partition']);

  return useMemo<SnapshotRow[]>(() => {
    const rows: SnapshotRow[] = [];

    // Add snapshot types row
    if (snapshotTypes && snapshotTypes.length > 0) {
      const enabledTypes = snapshotTypes.filter((st) => st.enabled);
      rows.push({
        type: t('partition:snapshots.types', 'Snapshot types'),
        name: enabledTypes.map((st) => st.label).join(', ') || t('partition:snapshots.no_types', 'None'),
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
