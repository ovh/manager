import { Outlet, redirect, useSearchParams } from 'react-router-dom';
import { useS3Data } from '../../S3.context';
import queryClient from '@/query.client';
import { getS3Object } from '@/data/api/storage/s3Storage.api';

interface ObjectLayoutProps {
  params: {
    projectId: string;
    region: string;
    s3Name: string;
  };
  request: Request;
}

// try to fetch the object data, redirect to objects page if it fails
export const Loader = async ({ params, request }: ObjectLayoutProps) => {
  const { projectId, region, s3Name } = params;
  const url = new URL(request.url);
  const objectKey = url.searchParams.get('objectKey');

  return queryClient
    .fetchQuery({
      queryKey: [
        projectId,
        'region',
        region,
        'storage',
        s3Name,
        'object',
        objectKey,
      ],
      queryFn: () =>
        getS3Object({
          projectId,
          region,
          name: s3Name,
          key: objectKey,
        }),
    })
    .then(
      () => true,
      () =>
        redirect(
          `/pci/projects/${projectId}/storages/objects/s3/${region}/${s3Name}/objects`,
        ),
    );
};

function ObjectKey() {
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');
  return objectKey;
}

export function breadcrumb() {
  return <ObjectKey />;
}

export default function ObjectLayout() {
  const parentOutletData = useS3Data();
  return <Outlet context={parentOutletData} />;
}
