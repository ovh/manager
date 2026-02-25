import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useS3Data } from '../../../S3.context';
import DataTable from '@/components/data-table';
import S3ObjectVersionList from './_components/S3VersionObjectListTable.component';
import { useGetS3ObjectVersions } from '@/data/hooks/s3-storage/useGetS3ObjectVersions.hook';
import { ObjectSelectionProvider } from '../../_contexts/ObjectSelection.context';

const S3ObjectVersions = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');

  const objectVersionQuery = useGetS3ObjectVersions({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
  });

  if (objectVersionQuery.isLoading) {
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
        <DataTable.Skeleton columns={4} rows={10} width={100} height={16} />
      </>
    );
  }

  return (
    <ObjectSelectionProvider>
      <h2>{t('versionsTitle')}</h2>
      <S3ObjectVersionList
        objects={objectVersionQuery.data}
        onRefreshClicked={objectVersionQuery.refetch}
        isLoading={objectVersionQuery.isFetching}
      />
      <Outlet />
    </ObjectSelectionProvider>
  );
};

export default S3ObjectVersions;
