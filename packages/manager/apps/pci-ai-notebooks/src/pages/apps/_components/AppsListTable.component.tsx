import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import { getColumns } from './AppsListColumns.component';
import { getFilters } from './AppsListFilters.component';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';

interface AppsListProps {
  apps: ai.app.App[];
}

export default function AppsList({ apps }: AppsListProps) {
  const { t } = useTranslation('pci-ai-deploy/apps');
  const navigate = useNavigate();

  const columns: ColumnDef<ai.app.App>[] = getColumns({
    onStartClicked: (app: ai.app.App) => {
      navigate(`./start/${app.id}`);
    },
    onStopClicked: (app: ai.app.App) => {
      navigate(`./stop/${app.id}`);
    },
    onDeleteClicked: (app: ai.app.App) => {
      navigate(`./delete/${app.id}`);
    },
  });

  const appsFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={apps}
      pageSize={25}
      filtersDefinition={appsFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-app-button"
            onClick={() => {
              navigate('./new');
            }}
          >
            <Plus className="size-6 mr-2 text-primary-foreground" />
            {t('createNewApp')}
          </Button>
        </DataTable.Action>
        <DataTable.SearchBar />
        <DataTable.FiltersButton />
      </DataTable.Header>
      <DataTable.FiltersList />
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
}

AppsList.Skeleton = function AppsListSkeleton() {
  return (
    <>
      <div
        data-testid="app-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-20 w-48" />
        <div className="flex">
          <Skeleton className="h-20 w-48" />
          <Skeleton className="h-20 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
