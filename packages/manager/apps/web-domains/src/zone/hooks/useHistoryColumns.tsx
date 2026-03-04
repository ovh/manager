import { useMemo } from 'react';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { TFunction } from 'i18next';
import {
  CreationDateCell,
  DownloadZoneCell,
  RestoreZoneCell,
  ViewZoneCell,
} from '@/zone/components/HistoryCells';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';

interface UseHistoryColumnsProps {
  readonly t: TFunction;
  readonly onView: (item: TZoneHistoryWithDate) => void;
  readonly onRestore: (item: TZoneHistoryWithDate) => void;
  readonly zoneName: string;
  readonly activeZoneId?: string;
  readonly canRestore?: boolean;
}

export const useHistoryColumns = ({
  t,
  onView,
  onRestore,
  zoneName,
  activeZoneId,
  canRestore,
}: UseHistoryColumnsProps): DatagridColumn<TZoneHistoryWithDate>[] => {
  return useMemo(
    () => [
      {
        id: 'creationDate',
        label: t('zone_history_creation_date'),
        cell: (item: TZoneHistoryWithDate) => (
          <CreationDateCell
            row={item}
            isActive={activeZoneId === item.id}
          />
        ),
        isSortable: true,
      },
      {
        id: 'view',
        label: t('zone_history_view_label'),
        cell: (item: TZoneHistoryWithDate) => (
          <ViewZoneCell row={item} onView={onView} />
        ),
        isSortable: false,
      },
      {
        id: 'download',
        label: t('zone_history_download_label'),
        cell: (item: TZoneHistoryWithDate) => (
          <DownloadZoneCell row={item} zoneName={zoneName} />
        ),
        isSortable: false,
      },
      {
        id: 'restore',
        label: t('zone_history_restore_label'),
        cell: (item: TZoneHistoryWithDate) => (
          <RestoreZoneCell
            row={item}
            onRestore={onRestore}
            isActive={activeZoneId === item.id}
            canRestore={canRestore}
          />
        ),
        isSortable: false,
      },
    ],
    [onRestore, onView, zoneName, activeZoneId, canRestore],
  );
};
