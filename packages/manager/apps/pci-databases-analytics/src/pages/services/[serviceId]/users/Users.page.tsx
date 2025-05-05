import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { GenericUser } from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { getColumns } from './_components/UsersTableColumns.component';
import DataTable from '@/components/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { FilterCategories } from '@/lib/filters';
import UserStatusBadge from './_components/UserStatusBadge.component';
import ToggleAcl from './_components/ToggleAcl.component';
import PatternSubRow from './_components/PatternsSubRow.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/users"
    />
  );
}

const Users = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const { projectId, service } = useServiceData();
  const navigate = useNavigate();
  const { isUserActive } = useUserActivityContext();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.USERS,
  });
  const aclsEnabled = !!('aclsEnabled' in service && service.aclsEnabled);

  const columns: ColumnDef<GenericUser>[] = getColumns({
    displayGroupCol: service.engine === database.EngineEnum.m3db,
    displayACLSCol: aclsEnabled,
    displayRolesCol: [
      database.EngineEnum.mongodb,
      database.EngineEnum.postgresql,
    ].includes(service.engine),
    displayKeysCols: [database.EngineEnum.redis, database.EngineEnum.valkey].includes(service.engine),
    displayCategoriesCol: [database.EngineEnum.redis, database.EngineEnum.valkey].includes(service.engine),
    displayCommandsCol: [database.EngineEnum.redis, database.EngineEnum.valkey].includes(service.engine),
    displayChannelsCol: [database.EngineEnum.redis, database.EngineEnum.valkey].includes(service.engine),
    onDeleteClicked: (user: GenericUser) => {
      navigate(`./delete/${user.id}`);
    },
    onResetPasswordClicked: (user: GenericUser) => {
      navigate(`./reset-password/${user.id}`);
    },
    onEditClicked: (user: GenericUser) => {
      navigate(`./edit/${user.id}`);
    },
  });
  let rowExpension = null;

  if (aclsEnabled) {
    rowExpension = (user: GenericUser) => (
      <div className="p-4">
        {'acls' in user && <PatternSubRow user={user} />}
      </div>
    );
  }

  const filters = [
    {
      id: 'username',
      label: "Nom d'utilisateur",
      comparators: FilterCategories.String,
    },
    {
      id: 'createdAt',
      label: 'Date de création',
      comparators: FilterCategories.Date,
    },
    {
      id: 'status',
      label: 'Statut',
      comparators: FilterCategories.Options,
      options: Object.values(database.StatusEnum).map((value) => ({
        label: <UserStatusBadge status={value} />,
        value,
      })),
    },
  ];

  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.userAcls?.read ===
        database.service.capability.StateEnum.enabled && <ToggleAcl />}
      {usersQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={usersQuery.data}
          pageSize={25}
          filtersDefinition={filters}
        >
          <DataTable.Header>
            {service.capabilities.users?.create && (
              <DataTable.Action>
                <Button
                  data-testid="users-add-button"
                  mode={'outline'}
                  disabled={
                    service.capabilities.users?.create ===
                    database.service.capability.StateEnum.disabled
                  }
                  onClick={() => navigate('./add')}
                >
                  <Plus className="size-4 mr-2" />
                  {t('addButtonLabel')}
                </Button>
              </DataTable.Action>
            )}
            <DataTable.SearchBar />
            <DataTable.FiltersButton />
          </DataTable.Header>
          <DataTable.FiltersList />
          <DataTable.Table renderRowExpansion={rowExpension} />
          <DataTable.Pagination />
        </DataTable.Provider>
      ) : (
        <DataTable.Skeleton />
      )}

      <Outlet />
    </>
  );
};

export default Users;
