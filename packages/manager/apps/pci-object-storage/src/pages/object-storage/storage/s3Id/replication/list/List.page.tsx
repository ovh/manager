import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useS3Data } from '../../S3.context';
import ReplicationList from '../_components/table/ReplicationList.component';
import Guides from '@/components/guides/Guides.component';

const ReplicationListPage = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { s3, s3Query } = useS3Data();

  const { replication } = s3;

  const replicationRules = useMemo(() => {
    if (!replication?.rules) return [];
    return replication?.rules
      ?.map((repl, index) => ({
        ...repl,
        index: `${index}`,
      }))
      .sort((a, b) => {
        const cmpPriority = b.priority - a.priority;
        if (cmpPriority !== 0) return cmpPriority;
        return b.destination.name.localeCompare(a.destination.name);
      });
  }, [replication?.rules]);

  if (s3Query.isLoading) return <ReplicationList.Skeleton />;

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides selectors={['asyncReplication']} />
      </div>
      <ReplicationList replicationRules={replicationRules} />
      <Outlet />
    </>
  );
};

export default ReplicationListPage;
