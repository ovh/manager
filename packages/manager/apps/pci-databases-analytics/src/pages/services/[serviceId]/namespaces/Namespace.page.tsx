import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';

import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useServiceData } from '../Service.context';
import { POLLING } from '@/configuration/polling.constants';
import { getColumns } from './_components/NamespacesTableColumns.component';
import { NAMESPACES_CONFIG } from './_components/formNamespace/namespace.constants';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useGetNamespaces } from '@/hooks/api/database/namespace/useGetNamespaces.hook';
import DataTable from '@/components/data-table';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/namespaces"
    />
  );
}

const Namespaces = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );
  const { projectId, service } = useServiceData();
  const { isUserActive } = useUserActivityContext();
  const namespacesQuery = useGetNamespaces(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.NAMESPACES,
    },
  );

  const columns: ColumnDef<database.m3db.Namespace>[] = getColumns({
    onEditClick: (namespace: database.m3db.Namespace) =>
      navigate(`./edit/${namespace.id}`),
    onDeleteClick: (namespace: database.m3db.Namespace) =>
      navigate(`./delete/${namespace.id}`),
  });

  return (
    <>
      <h2>{t('title')}</h2>
      <p>
        {t('description1', {
          max: NAMESPACES_CONFIG.maxNamespaceNumber,
        })}
      </p>
      <p>{t('description2')}</p>
      <p>{t('description3')}</p>
      {namespacesQuery.isSuccess && service.capabilities.namespaces?.create && (
        <Button
          data-testid="namespaces-add-button"
          disabled={
            service.capabilities.namespaces?.create ===
              database.service.capability.StateEnum.disabled ||
            namespacesQuery.data?.length >= NAMESPACES_CONFIG.maxNamespaceNumber
          }
          mode={'outline'}
          size="sm"
          className="text-base"
          onClick={() => navigate('./add')}
        >
          <Plus className="size-4 mr-2" />
          {t('addButtonLabel')}
        </Button>
      )}
      {namespacesQuery.isSuccess ? (
        <DataTable.Provider
          columns={columns}
          data={namespacesQuery.data}
          pageSize={25}
        />
      ) : (
        <div data-testid="namespaces-table-skeleton">
          <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Namespaces;
