import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useInstance } from '@/data/hooks/instance/useInstance';
import InstanceGeneralDetails from './component/InstanceGeneralDetails.component';
import InstanceProperty from './component/InstanceProperty.component';
import Network from './component/Network.component';
import { Spinner } from '@/components/spinner/Spinner.component';

const Dashboard: FC = () => {
  const { instanceId } = useParams() as { instanceId: string };

  const { data: instance, isLoading } = useInstance(instanceId, {});

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
      {instance && (
        <>
          <InstanceGeneralDetails
            flavorName={instance.flavorName}
            availabilityZone={instance.availabilityZone}
            region={instance.region}
            regionType={instance.regionType}
            memory={instance.flavorSpecs.ram}
            cpu={instance.flavorSpecs.cpu}
            prices={instance.prices}
          />
          <InstanceProperty
            storage={instance.flavorSpecs.storage}
            publicBandwidth={instance.flavorSpecs.bandwidth.public}
            volumes={instance.volumes}
            image={instance.imageName}
            instanceId={instance.id}
            sshKey={instance.sshKey}
            sshLogin={instance.login}
          />
        </>
      )}
      <Network />
    </div>
  );
};

export default Dashboard;
