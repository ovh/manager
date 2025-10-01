import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useS3Data } from '../S3.context';
import ReplicationList from './_components/ReplicationList.component';

const Replication = () => {
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
      <ReplicationList replicationRules={replicationRules} />
      <Outlet />
    </>
  );
};

export default Replication;
