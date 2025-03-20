import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getColumns } from './JobsListColumns.component';
import { getFilters } from './JobListFilters.component';
import DataTable from '@/components/data-table';

interface JobsListProps {
  jobs: ai.job.Job[];
}

export default function JobsList({ jobs }: JobsListProps) {
  const { t } = useTranslation('ai-tools/jobs');
  const navigate = useNavigate();

  const columns: ColumnDef<ai.job.Job>[] = getColumns({
    onRestartClicked: (job: ai.job.Job) => {
      navigate(`./restart/${job.id}`);
    },
    onStopClicked: (job: ai.job.Job) => {
      navigate(`./stop/${job.id}`);
    },
    onDeleteClicked: (job: ai.job.Job) => {
      navigate(`./delete/${job.id}`);
    },
  });

  const jobsFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={jobs}
      pageSize={25}
      filtersDefinition={jobsFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-job-button"
            onClick={() => {
              navigate('./new');
            }}
          >
            <Plus className="size-6" />
            {t('createNewJob')}
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

JobsList.Skeleton = function JobsListSkeleton() {
  return (
    <>
      <div
        data-testid="jobs-list-table-skeleton"
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
