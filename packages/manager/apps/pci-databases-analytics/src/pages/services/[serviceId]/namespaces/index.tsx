import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { Plus } from 'lucide-react';
import { H2, P } from '@/components/typography';
import { database } from '@/models/database';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import { useModale } from '@/hooks/useModale';
import { useGetNamespaces } from '@/hooks/api/namespaces.api.hooks';

import { useServiceData } from '../layout';
import { POLLING } from '@/configuration/polling';
import { getColumns } from './_components/namespacesTableColumns';
import DeleteNamespaceModal from './_components/deleteNamespace';
import AddEditNamespace from './_components/addEditNamespace';

export function breadcrumb() {
  return 'Namespaces';
}

const Namespaces = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/namespaces',
  );
  const { projectId, service } = useServiceData();
  const addModale = useModale('add');
  const deleteModale = useModale('delete');
  const editModale = useModale('edit');
  const namespacesQuery = useGetNamespaces(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.NAMESPACES,
    },
  );

  const columns: ColumnDef<database.m3db.Namespace>[] = getColumns({
    onEditClick: (namespace: database.m3db.Namespace) =>
      editModale.open(namespace.id),
    onDeleteClick: (namespace: database.m3db.Namespace) =>
      deleteModale.open(namespace.id),
  });

  const namespaceToDelete: database.m3db.Namespace = namespacesQuery.data?.find(
    (np) => np.id === deleteModale.value,
  );

  const namespaceToEdit: database.m3db.Namespace = namespacesQuery.data?.find(
    (np) => np.id === editModale.value,
  );

  return (
    <>
      <H2 className="mb-2">{t('title')}</H2>
      <P className="mb-2">{t('description1')}</P>
      <P className="mb-2">{t('description2')}</P>
      <P className="mb-2">{t('description3')}</P>
      <Button
        variant={'outline'}
        size="sm"
        className="text-base mb-2"
        onClick={() => addModale.open()}
      >
        <Plus className="size-4 mr-2" />
        {t('addButtonLabel')}
      </Button>

      {namespacesQuery.isSuccess ? (
        <DataTable
          columns={columns}
          data={namespacesQuery.data}
          pageSize={25}
        />
      ) : (
        <DataTable.Skeleton columns={5} rows={2} width={100} height={16} />
      )}
      {namespacesQuery.isSuccess && (
        <AddEditNamespace
          isEdition={false}
          controller={addModale.controller}
          namespaces={namespacesQuery.data}
          service={service}
          onSuccess={() => {
            addModale.close();
            namespacesQuery.refetch();
          }}
        />
      )}

      {namespaceToDelete && (
        <DeleteNamespaceModal
          controller={deleteModale.controller}
          service={service}
          namespace={namespaceToDelete}
          onSuccess={() => {
            deleteModale.close();
            namespacesQuery.refetch();
          }}
        />
      )}

      {namespacesQuery.isSuccess && namespaceToEdit && (
        <AddEditNamespace
          isEdition={true}
          controller={editModale.controller}
          namespaces={namespacesQuery.data}
          editedNamespace={namespaceToEdit}
          service={service}
          onSuccess={() => {
            editModale.close();
            namespacesQuery.refetch();
          }}
        />
      )}
    </>
  );
};

export default Namespaces;
