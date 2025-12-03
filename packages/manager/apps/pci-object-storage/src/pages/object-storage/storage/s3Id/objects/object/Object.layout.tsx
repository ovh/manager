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
import { ObjStoError } from '@/data/api';

function ObjectKey() {
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');
  return objectKey;
}

export function breadcrumb() {
  return <ObjectKey />;
}

export default function ObjectLayout() {
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
        <div className="flex gap-2 items-center mt-4 mb-6">
          <Skeleton className="rounded-full h-14 w-14" />
          <div>
            <h2>...</h2>
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Skeleton className="w-full h-[200px]" />
        </div>
      </>
    );
  }
  return <Outlet context={parentOutletData} />;
}
