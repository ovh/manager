import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { OdsDivider } from '@ovhcloud/ods-components/react';

import QuickAccess from './components/QuickAccess.component';
import Others from './components/Others.component';
import DashboardTiles from './components/DashboardTiles.component';

export default function Home() {
  const { t } = useTranslation('home');
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    throw Error(t('project_identifier_missing'));
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
