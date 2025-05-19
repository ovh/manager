import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useInstance } from '@/data/hooks/instance/useInstance';
import Information from './component/Information.component';
import Property from './component/Property.component';
import Network from './component/Network.component';
import { Spinner } from '@/components/spinner/Spinner.component';

const Dashboard: FC = () => {
  const { instanceId } = useParams() as { instanceId: string };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: instance, isLoading } = useInstance(instanceId, {});

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
      <Information />
      <Property />
      <Network />
    </div>
  );
};

export default Dashboard;
