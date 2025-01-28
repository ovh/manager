import { useParams } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/manager-react-components';

export default function Dashboard() {
  const { projectId } = useParams();

  return (
    <RedirectionGuard
      isLoading={false}
      route={`/pci/projects/${projectId}/ai/endpoints`}
      condition={false}
    >
      <></>
    </RedirectionGuard>
  );
}
