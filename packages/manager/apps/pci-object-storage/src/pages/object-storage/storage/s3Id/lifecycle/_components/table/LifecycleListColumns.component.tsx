import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Badge } from '@datatr-ux/uxlib';
import storages from '@/types/Storages';
import { ActionsMenu } from './ActionsMenu.component';
import LinkComponent from '@/components/links/Link.component';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';

type GetColumnsParams = {
  onEditClicked: (lifecycle: storages.LifecycleRule) => void;
  onDeleteClicked: (lifecycle: storages.LifecycleRule) => void;
  onToggleStatusClicked: (lifecycle: storages.LifecycleRule) => void;
  isVersioningEnabled?: boolean;
};

const getCurrentVersionOperationsCount = (
  rule: storages.LifecycleRule,
): number => {
  let count = 0;
  if (rule.transitions?.length) {
    count += rule.transitions.length;
  }
  if (rule.expiration?.days) {
    count += 1;
  }
  return count;
};

const getNoncurrentVersionOperationsCount = (
  rule: storages.LifecycleRule,
): number => {
  let count = 0;
  if (rule.noncurrentVersionTransitions?.length) {
    count += rule.noncurrentVersionTransitions.length;
  }
  if (rule.noncurrentVersionExpiration?.noncurrentDays) {
    count += 1;
  }
  return count;
};

export function getColumns({
  onEditClicked,
  onDeleteClicked,
  onToggleStatusClicked,
  isVersioningEnabled = true,
}: GetColumnsParams): ColumnDef<storages.LifecycleRule>[] {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  return [
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="truncate max-w-24">{t('columnName')}</span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <LinkComponent to={`./edit/${row.original.id}`}>
          <span className="truncate block max-w-32">{row.original.id}</span>
        </LinkComponent>
      ),
    },

    {
      id: 'scope',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="truncate max-w-20">{t('columnScope')}</span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const prefix = row.original.filter?.prefix;
        const tags = row.original.filter?.tags;
        const tagsCount = tags ? Object.keys(tags).length : 0;
        const isFiltered = Boolean(prefix || tagsCount);

        return (
          <span>{isFiltered ? t('scopeFiltered') : t('scopeAllObjects')}</span>
        );
      },
    },
    {
      id: 'currentVersionOperations',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="block max-w-28 whitespace-normal leading-tight">
            {t('columnCurrentVersionOperations')}
          </span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const count = getCurrentVersionOperationsCount(row.original);
        return (
          <span>
            {count > 0 ? t('operationsCount', { count }) : t('noOperations')}
          </span>
        );
      },
    },
    {
      id: 'noncurrentVersionOperations',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="block max-w-28 whitespace-normal leading-tight">
            {t('columnNoncurrentVersionOperations')}
          </span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        if (!isVersioningEnabled) {
          return <span>-</span>;
        }
        const count = getNoncurrentVersionOperationsCount(row.original);
        return (
          <span>
            {count > 0 ? t('operationsCount', { count }) : t('noOperations')}
          </span>
        );
      },
    },
    {
      id: 'deleteMarker',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="block max-w-28 whitespace-normal leading-tight">
            {t('columnDeleteMarker')}
          </span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const isEnabled = Boolean(
          row.original.expiration?.expiredObjectDeleteMarker,
        );
        return (
          <Badge variant={isEnabled ? 'success' : 'neutral'}>
            {t(isEnabled ? 'statusEnabled' : 'statusDisabled')}
          </Badge>
        );
      },
    },
    {
      id: 'abortMultipart',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="block max-w-28 whitespace-normal leading-tight">
            {t('columnAbortMultipart')}
          </span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => {
        const isEnabled = Boolean(
          row.original.abortIncompleteMultipartUpload?.daysAfterInitiation,
        );
        return (
          <Badge variant={isEnabled ? 'success' : 'neutral'}>
            {t(isEnabled ? 'statusEnabled' : 'statusDisabled')}
          </Badge>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          <span className="truncate max-w-20">{t('columnStatus')}</span>
        </DataTable.SortableHeader>
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'enabled' ? 'success' : 'warning'}
        >
          {t(
            row.original.status === 'enabled'
              ? 'statusEnabled'
              : 'statusDisabled',
          )}
        </Badge>
      ),
    },
    {
      id: MENU_COLUMN_ID,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <ActionsMenu
          lifecycle={row.original}
          onEdit={onEditClicked}
          onDelete={onDeleteClicked}
          onToggleStatus={onToggleStatusClicked}
        />
      ),
    },
  ];
}
