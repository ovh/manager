import { Outlet, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Listing from '@/components/Listing';
import useProject from '@/hooks/useProject';
import useInstances from '@/hooks/useInstance';

export default function ListingPage() {
  const { t } = useTranslation('common');

  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const { data: instances } = useInstances(projectId || '');

  const headers = [
    {
      title: 'ID',
      property: 'id',
    },
    {
      title: 'Name',
      property: 'name',
    },
    {
      title: 'Region',
      property: 'region',
    },
    {
      title: 'Status',
      property: 'status',
    },
  ];

  return (
    <>
      Listing page {t('hello')}
      {project && <p>Project {project.description}</p>}
      <Link to="./new">Create an instance</Link>
      {instances && (
        <>
          <Listing headers={headers} items={instances} />
          <ul>
            <li>
              <Link to={`./${instances[0].id}`}>Instance Dashboard</Link>
            </li>
            <li>
              <Link to={`./boot?instanceId=${instances[0].id}`}>
                Boot an instance
              </Link>
            </li>
          </ul>
        </>
      )}
      <Outlet />
    </>
  );
}
