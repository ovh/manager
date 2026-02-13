import { useState } from 'react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useToast } from '@datatr-ux/uxlib';
import { getColumns } from './S3ObjectVersionListColumns.component';
import DataTable from '@/components/data-table';
import { getFilters } from './S3VersionObjectFilters.component';
import storages from '@/types/Storages';
import useDownload from '@/hooks/useDownload.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { useS3Data } from '../../../../S3.context';
import RefreshButton from '@/components/refresh-button/RefreshButton.component';
import { BulkActionButton } from '../../../_components/BulkActionButton.component';

interface ObjectsListProps {
  objects: StorageObject[];
  onRefreshClicked: () => void;
  isLoading: boolean;
}

const S3ObjectVersionList = ({
  objects,
  onRefreshClicked,
  isLoading,
}: ObjectsListProps) => {
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
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (presignUrl) => {
      download({ type: 'url', url: presignUrl.url }, objectName);
    },
  });

  const columns: ColumnDef<StorageObject>[] = getColumns({
    isPending: pendingGetPresignUrl,
    objects,
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
          versionId: object.versionId,
        },
      });
    },
    onDeleteClicked: (object: StorageObject) => {
      return navigate(
        `./delete-version/${object.versionId}?objectKey=${encodeURIComponent(
          object.key,
        )}`,
      );
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
          <BulkActionButton />
        </DataTable.Action>
        <RefreshButton onClick={onRefreshClicked} isLoading={isLoading} />
        <DataTable.SearchBar />
        <DataTable.FiltersButton />
      </DataTable.Header>
      <DataTable.FiltersList />
      <DataTable.Table />
      <DataTable.Pagination />
    </DataTable.Provider>
  );
};

export default S3ObjectVersionList;
