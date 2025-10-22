import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { useS3Data } from '../S3.context';
import S3ObjectsList from './_components/S3ObjectListTable.component';
import { useGetS3Objects } from '@/data/hooks/s3-storage/useGetS3Objects.hook';
import DataTable from '@/components/data-table';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';

const Objects = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const objectQuery = useGetS3Objects({
    projectId,
    region: s3.region,
    name: s3.name,
    withVersions: true,
  });

  if (objectQuery.isLoading) return <Objects.Skeleton />;

  return (
    <>
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
          <RoadmapChangelog />
        </div>
      </div>
      <S3ObjectsList
        objects={objectQuery.data?.filter((obj) => obj.isLatest === true)}
      />
      <Outlet />
    </>
  );
};

Objects.Skeleton = function ObjectsListSkeleton() {
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
};

export default Objects;
