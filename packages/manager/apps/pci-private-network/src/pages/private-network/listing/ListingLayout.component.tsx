import { useParams } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { usePrivateNetworks } from '@/data/hooks/networks/useNetworks';

const ListingLayout: React.FC = () => {
  const { projectId } = useParams();
  const { isPending } = usePrivateNetworks(projectId);

  // if (isPending) {
  return (
    <OsdsSpinner
      inline
      size={ODS_SPINNER_SIZE.lg}
      className="block text-center"
    />
  );
  // }

  return (
    <>
      <h1>{projectId}</h1>
      <h1>tsiori</h1>
    </>
  );
};

export default ListingLayout;
