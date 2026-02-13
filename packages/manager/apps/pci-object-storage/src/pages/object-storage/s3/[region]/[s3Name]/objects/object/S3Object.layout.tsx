import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useEffect } from 'react';
import { Skeleton } from '@datatr-ux/uxlib';
import { useS3Data } from '../../S3.context';
import { useGetS3Object } from '@/data/hooks/s3-storage/useGetS3Object.hook';
import ObjectTabs from './_components/ObjectTabs.component';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useGetS3ObjectVersions } from '@/data/hooks/s3-storage/useGetS3ObjectVersions.hook';
import { ObjectHeader } from './_components/ObjectHeader.component';
import { ObjStoError } from '@/data/api';

const ObjectKey = () => {
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');
  return objectKey;
};

const breadcrumb = () => <ObjectKey />;

const S3Object = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');

  const parentOutletData = useS3Data();

  const { s3 } = parentOutletData;
  const objectQuery = useGetS3Object({
    projectId,
    region: parentOutletData.s3.region,
    name: parentOutletData.s3.name,
    key: objectKey,
    options: { retry: false },
  });

  const objectVersionQuery = useGetS3ObjectVersions({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
  });

  // redirect if object is not found
  useEffect(() => {
    if (objectQuery.isError) {
      const error = objectQuery.error as ObjStoError;
      if (error?.response?.status === 404) {
        navigate(
          `/pci/projects/${projectId}/storages/objects/s3/${s3.region}/${s3.name}/objects`,
          { replace: true },
        );
      }
    }
  }, [objectQuery.isError, objectQuery.error, navigate, projectId, s3]);

  if (!objectQuery.data) {
    return (
      <>
        <ObjectHeader.Skeleton />
        <TabsMenu.Skeleton />
        <div className="flex space-x-4">
          <Skeleton className="w-1/2 h-[200px]" />
          <Skeleton className="w-1/2 h-[200px]" />
        </div>
      </>
    );
  }
  return (
    <>
      <ObjectHeader objectKey={objectKey} object={objectQuery.data} />
      <ObjectTabs versionsCount={objectVersionQuery.data?.length} />
      <div className="space-y-2">
        <Outlet context={parentOutletData} />
      </div>
    </>
  );
};

export { breadcrumb };
export default S3Object;
