import { useState } from 'react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Label, Switch, useToast } from '@datatr-ux/uxlib';
import { getColumns } from './S3ObjectListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './S3ObjectFilters.component';
import storages from '@/types/Storages';
import useDownload from '@/hooks/useDownload';
import { useDownloadSwiftObject } from '@/data/hooks/swift-storage/useDownloadObject.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

// export interface ObjectsWithDate extends storages.ContainerObject {
//   lastModifiedDate: Date;
// }

interface ObjectsListProps {
  objects: StorageObject[];
}

export default function S3ObjectsList({ objects }: ObjectsListProps) {
  const { projectId, swiftId } = useParams();
  const [objectName, setObjectName] = useState<string>('');
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
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

  // const objectsWithDate: ObjectsWithDate[] =
  //   objects.length > 0 ? createObjectWithDate(objects) : [];

  const columns: ColumnDef<StorageObject>[] = getColumns({
    isPending: isDownloadPending,
    onDownloadClicked: (object: StorageObject) => {
      setObjectName(object.key);
      // const oneWeekDate = add(new Date(), { weeks: 1 });
      // return downloadSwiftObject({
      //   projectId,
      //   containerId: swiftId,
      //   data: {
      //     objectName: object.name,
      //     expirationDate: formatRFC3339(oneWeekDate),
      //   },
      // });
    },
    onDeleteClicked: (object: StorageObject) => {
      return navigate(`./delete-object?objectName=${object.key}`);
    },
    onShowVersionClicked: (object: StorageObject) => {
      return navigate(`./delete-object?objectName=${object.key}`);
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
