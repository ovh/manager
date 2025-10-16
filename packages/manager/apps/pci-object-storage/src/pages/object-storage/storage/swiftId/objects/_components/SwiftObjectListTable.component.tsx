import { add, formatRFC3339 } from 'date-fns';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, useToast } from '@datatr-ux/uxlib';
import { getColumns } from './SwiftObjectListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './SwiftObjectFilters.component';
import storages from '@/types/Storages';
import useDownload from '@/hooks/useDownload';
import { useDownloadSwiftObject } from '@/data/hooks/swift-storage/useDownloadObject.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

interface ObjectsListProps {
  objects: storages.ContainerObject[];
}

export default function SwiftObjectsList({ objects }: ObjectsListProps) {
  const { projectId, swiftId } = useParams();
  const [objectName, setObjectName] = useState<string>('');
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  const navigate = useNavigate();
  const toast = useToast();
  const { download } = useDownload();

  const {
    downloadSwiftObject,
    isPending: isDownloadPending,
  } = useDownloadSwiftObject({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: async (downloadInfo: storages.ContainerObjectTempURL) => {
      download({ type: 'url', url: downloadInfo.getURL }, objectName);
    },
  });

  const columns: ColumnDef<storages.ContainerObject>[] = getColumns({
    isPending: isDownloadPending,
    onDownloadClicked: (object: storages.ContainerObject) => {
      setObjectName(object.name);
      const oneWeekDate = add(new Date(), { weeks: 1 });
      return downloadSwiftObject({
        projectId,
        containerId: swiftId,
        data: {
          objectName: object.name,
          expirationDate: formatRFC3339(oneWeekDate),
        },
      });
    },
    onDeleteClicked: (object: storages.ContainerObject) => {
      return navigate(`./delete-object?objectName=${object.name}`);
    },
  });
  const storagesFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={objects}
      pageSize={25}
      filtersDefinition={storagesFilters}
    >
      <DataTable.Header>
        <DataTable.Action>
          <Button
            onClick={() => {
              navigate('./add-object');
            }}
          >
            <Plus className="size-6 mr-2 text-primary-foreground" />
            {t('addNewObject')}
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
