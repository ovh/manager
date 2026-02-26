import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LifecycleList from '../_components/table/LifecycleList.component';
import Guides from '@/components/guides/Guides.component';
import { useGetS3Lifecycle } from '@/data/hooks/s3-storage/useGetS3Lifecycle.hook';

const LifecycleListPage = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const { projectId, region, s3Name } = useParams();

  const lifecycleQuery = useGetS3Lifecycle({
    projectId,
    region,
    name: s3Name,
  });

  if (lifecycleQuery.isLoading) return <LifecycleList.Skeleton />;

  const rules = lifecycleQuery.data?.rules ?? [];

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides selectors={['lifecycle']} />
      </div>
      <LifecycleList rules={rules} />
      <Outlet />
    </>
  );
};

export default LifecycleListPage;
