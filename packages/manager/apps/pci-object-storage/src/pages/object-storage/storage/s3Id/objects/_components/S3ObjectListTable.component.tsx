import { useState } from 'react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, useToast } from '@datatr-ux/uxlib';
import { getColumns } from './S3ObjectListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './S3ObjectFilters.component';
import storages from '@/types/Storages';
import useDownload from '@/hooks/useDownload';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { useS3Data } from '../../S3.context';

interface ObjectsListProps {
  objects: StorageObject[];
}

export default function S3ObjectsList({ objects }: ObjectsListProps) {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const [objectName, setObjectName] = useState<string>('');
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const navigate = useNavigate();
  const toast = useToast();
  const { download } = useDownload();

  const {
    getPresignUrlS3,
    isPending: pendingGetPresignUrl,
  } = useGetPresignUrlS3({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (presignUrl) => {
      download({ type: 'url', url: presignUrl.url }, objectName);
    },
  });

  const columns: ColumnDef<StorageObject>[] = getColumns({
    isPending: pendingGetPresignUrl,
    onDownloadClicked: (object: StorageObject) => {
      setObjectName(object.key);
      return getPresignUrlS3({
        projectId,
        region: s3.region,
        name: s3.name,
        data: {
          expire: 3600,
          method: storages.PresignedURLMethodEnum.GET,
          object: object.key,
          storageClass: object.storageClass,
          versionId: '',
        },
      });
    },
    onDeleteClicked: (object: StorageObject) => {
      return navigate(`./delete-object?objectKey=${object.key}`);
    },
  });
  const objectsFilters = getFilters();

  return (
    <DataTable.Provider
      columns={columns}
      data={objects}
      pageSize={25}
      filtersDefinition={objectsFilters}
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
