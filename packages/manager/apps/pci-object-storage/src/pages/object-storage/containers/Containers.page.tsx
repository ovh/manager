import { Outlet, useParams } from 'react-router-dom';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { POLLING } from '@/configuration/polling.constants';
import ContainersList from './_components/ContainerListTable.component';

const Containers = () => {
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const containersQuery = useGetStorages(projectId, {
    refetchInterval: isUserActive && POLLING.CONTAINERS,
  });

  if (containersQuery.isLoading) return <ContainersList.Skeleton />;
  return (
    <>
      <ContainersList containers={containersQuery?.data.resources || []} />
      <Outlet />
    </>
  );
};

export default Containers;
