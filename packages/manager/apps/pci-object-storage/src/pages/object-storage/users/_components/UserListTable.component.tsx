import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton, Button } from '@datatr-ux/uxlib';
import { getColumns } from './UsertListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './UserListFilters.component';
import user from '@/types/User';
import { UserWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';

interface UsersListProps {
  users: UserWithS3Credentials[];
}

export default function UsersList({ users }: UsersListProps) {
  const { t } = useTranslation('pci-object-storage/containers');
  const navigate = useNavigate();
  const columns: ColumnDef<UserWithS3Credentials>[] = getColumns({
    onImportUserAccessClicked: (us: UserWithS3Credentials) => {
      console.log(us);
    },
    onDownloadUserAccessClicked: (us: UserWithS3Credentials) => {
      console.log(us);
    },
    onDownloadRcloneClicked: (us: UserWithS3Credentials) => {
      console.log(us);
    },
    onSecretKeyClicked: (us: UserWithS3Credentials) => {
      console.log(us);
    },
    onDeleteClicked: (us: user.User) => {
      console.log(us);
    },
  });
  const usersFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={users}
      pageSize={25}
      filtersDefinition={usersFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            data-testid="create-service-button"
            onClick={() => {
              navigate('./new');
            }}
          >
            <Plus className="size-6 mr-2 text-primary-foreground" />
            {t('createNewContainer')}
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

UsersList.Skeleton = function UsersListSkeleton() {
  return (
    <>
      <div
        data-testid="service-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <DataTable.Skeleton columns={5} rows={10} width={100} height={16} />
    </>
  );
};
