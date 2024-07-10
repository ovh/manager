import { useParams } from 'react-router-dom';
import { useGetRegistries } from '@/hooks/api/registry-api/useGetRegistries';
import { useGetTokens } from '@/hooks/api/token-api/useGetTokens';
import { useGetUsers } from '@/hooks/api/user-api/useGetUsers';
import { useLocale } from '@/hooks/useLocale';
import { useGetNotebooks } from '@/hooks/api/notebook-api/useGetNotebooks';
import { useGetJobs } from '@/hooks/api/job-api/useGetJobs';
import { useGetApps } from '@/hooks/api/app-api/useGetApps';
import { useGetRegions } from '@/hooks/api/capabilities-api/useGetRegions';
import { useGetAuthorization } from '@/hooks/api/authorization-api/useGetAuthorization';
import { useGetDatastores } from '@/hooks/api/datastore-api/useGetDatastores';
import { useGetDatastore } from '@/hooks/api/datastore-api/useGetDatastore';
import { useGetGuides } from '@/hooks/api/guide-api/useGetGuides';

export default function Home() {
  const { projectId } = useParams();
  const locale = useLocale();
  console.log('salut');
  console.log(projectId);

  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: 30_000,
  });

  const jobsQuery = useGetJobs(projectId, {
    refetchInterval: 30_000,
  });

  const appsQuery = useGetApps(projectId, {
    refetchInterval: 30_000,
  });

  const userQuery = useGetUsers(projectId, {
    refetchInterval: 30_000,
  });

  const tokenQuery = useGetTokens(projectId, {
    refetchInterval: 30_000,
  });

  const registriesQuery = useGetRegistries(projectId, {
    refetchInterval: 30_000,
  });

  const regionsQuery = useGetRegions(projectId, {
    refetchInterval: 30_000,
  });

  const authorizationQuery = useGetAuthorization(projectId);

  const datastoresQuery = useGetDatastores(projectId, 'GRA');

  const datastoreQuery = useGetDatastore(projectId, 'GRA', 'myFirstS3');

  // const datastoreAuthQuery = useGetDatastoreAuth(projectId, 'GRA', 'myFirstS3');

  const guidesQuery = useGetGuides(
    projectId,
    'cli',
    locale.toLocaleLowerCase().replace('_', '-'),
  );

  console.log(notebooksQuery.data);
  console.log(jobsQuery.data);
  console.log(appsQuery.data);
  console.log(userQuery.data);
  console.log(tokenQuery.data);
  console.log(registriesQuery.data);
  console.log(regionsQuery.data);
  console.log(authorizationQuery.data);
  console.log(datastoresQuery.data);
  console.log(guidesQuery.data);
  console.log('Datastore');
  console.log(datastoreQuery.data);
  // console.log('DatastoreAuth');
  // console.log(datastoreAuthQuery.data);
  return (
    <>
      <h1>AI Dashboard</h1>
    </>
  );
}
