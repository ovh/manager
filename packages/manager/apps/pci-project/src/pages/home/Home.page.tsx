import { useParams } from 'react-router-dom';

import { OdsDivider } from '@ovhcloud/ods-components/react';

import QuickAccess from './components/QuickAccess.component';
import Others from './components/Others.component';
import DashboardTiles from './components/DashboardTiles.component';

export default function Home() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    // Option 1 : message d'erreur
    return <div>Erreur : identifiant projet manquant.</div>;
    // Option 2 : return null;
    // Option 3 : redirection (si tu utilises un router)
    // return <Navigate to="/erreur" />;
  }

  return (
    <>
      <QuickAccess projectId={projectId} />
      <Others projectId={projectId} />
      <OdsDivider className="my-8 block" />
      <DashboardTiles projectId={projectId} />
    </>
  );
}
