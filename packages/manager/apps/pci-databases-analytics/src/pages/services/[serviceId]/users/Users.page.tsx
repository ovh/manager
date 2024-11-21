import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { GenericUser } from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { getColumns } from './_components/UsersTableColumns.component';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';

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
  const columns: ColumnDef<GenericUser>[] = getColumns({
    displayGroupCol: service.engine === database.EngineEnum.m3db,
    displayRolesCol: [
      database.EngineEnum.mongodb,
      database.EngineEnum.postgresql,
    ].includes(service.engine),
    displayKeysCols: service.engine === database.EngineEnum.redis,
    displayCategoriesCol: service.engine === database.EngineEnum.redis,
    displayCommandsCol: service.engine === database.EngineEnum.redis,
    displayChannelsCol: service.engine === database.EngineEnum.redis,
    onDeleteClicked: (user: GenericUser) => {
      navigate(`./delete/${user.id}`);
    },
    onResetPasswordClicked: (user: GenericUser) => {
      navigate(`./resetPassword/${user.id}`);
    },
    onEditClicked: (user: GenericUser) => {
      navigate(`./edit/${user.id}`);
    },
  });

  return (
    <>
      <h2>{t('title')}</h2>
      {service.capabilities.users?.create && (
        <Button
          data-testid="users-add-button"
          variant={'outline'}
          size="sm"
          className="text-base"
          disabled={
            service.capabilities.users?.create ===
            database.service.capability.StateEnum.disabled
          }
          onClick={() => navigate('./add')}
        >
          <Plus className="size-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}

      {usersQuery.isSuccess ? (
        <DataTable columns={columns} data={usersQuery.data} pageSize={25} />
      ) : (
        <div data-testid="users-table-skeleton">
          <DataTable.Skeleton columns={3} rows={5} width={100} height={16} />
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Users;
