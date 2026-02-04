import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { getColumns } from './LifecycleListColumns.component';
import DataTable from '@/components/data-table';
import storages from '@/types/Storages';

interface LifecycleListProps {
  rules: storages.LifecycleRule[];
}

export default function LifecycleList({ rules }: Readonly<LifecycleListProps>) {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const navigate = useNavigate();

  const columns = getColumns({
    onEditClicked: (lifecycle) => {
      navigate(`./edit/${lifecycle.id}`);
    },
    onDeleteClicked: (lifecycle) => {
      navigate(`./delete/${lifecycle.id}`);
    },
    onToggleStatusClicked: (lifecycle) => {
      const action = lifecycle.status === 'enabled' ? 'disable' : 'enable';
      navigate(`./${action}/${lifecycle.id}`);
    },
  });

  return (
    <DataTable.Provider columns={columns} data={rules} pageSize={25}>
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-lifecycle-button"
            onClick={() => {
              navigate('./new');
            }}
          >
            <Plus className="size-6" />
            {t('createLifecycle')}
          </Button>
        </DataTable.Action>
        <DataTable.SearchBar />
      </DataTable.Header>
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
}

LifecycleList.Skeleton = function LifecycleListSkeleton() {
  return (
    <>
      <div
        data-testid="lifecycle-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
      <DataTable.Skeleton columns={8} rows={10} width={100} height={16} />
    </>
  );
};
