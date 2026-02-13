import { Outlet, redirect, useParams, useMatches } from 'react-router-dom';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { POLLING } from '@/configuration/polling.constants';
import queryClient from '@/query.client';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { getS3Storage } from '@/data/api/storage/s3Storage.api';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { S3Header } from './_components/S3Header.component';
import S3Tabs from './_components/S3Tabs.component';

interface S3LayoutProps {
  params: {
    projectId: string;
    region: string;
    s3Name: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: S3LayoutProps) => {
  const { projectId, region, s3Name } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'region', region, 'storage', s3Name],
      queryFn: () => getS3Storage({ projectId, region, name: s3Name }),
    })
    .then(
      () => true,
      () => redirect(`/pci/projects/${projectId}/storages/objects`),
    );
};

const S3Name = () => {
  const { s3Name } = useParams();
  if (!s3Name) return '';
  return s3Name;
};

const breadcrumb = () => <S3Name />;

const HIDE_HEADER_ROUTE_PATTERNS = ['s3.object.'];

const shouldHideS3Header = (
  matches: ReturnType<typeof useMatches>,
): boolean => {
  return matches.some((match) =>
    HIDE_HEADER_ROUTE_PATTERNS.some((pattern) => match.id?.startsWith(pattern)),
  );
};

const S3 = () => {
  const { isUserActive } = useUserActivityContext();
  const { projectId, region, s3Name } = useParams();
  const matches = useMatches();
  const s3Query = useGetS3({
    projectId,
    region,
    name: s3Name,
    options: {
      refetchInterval: isUserActive && POLLING.S3,
      placeholderData: (prev) => prev,
    },
  });

  const isOnObjectView = shouldHideS3Header(matches);
  const shouldHideHeader = isOnObjectView;
  const shouldHideTabs = isOnObjectView;

  const s3 = s3Query.data;
  if (!s3) {
    return (
      <>
        <S3Header.Skeleton />
        <TabsMenu.Skeleton />
        Loading your container data
      </>
    );
  }
  const s3LayoutContext = {
    s3,
    s3Query,
  };

  return (
    <>
      {!shouldHideHeader && <S3Header s3={s3} />}
      {!shouldHideTabs && <S3Tabs s3={s3} />}
      <div className="space-y-2">
        <Outlet context={s3LayoutContext} />
      </div>
    </>
  );
};

export { breadcrumb };
export default S3;
