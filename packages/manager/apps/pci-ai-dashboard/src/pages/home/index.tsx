import { useParams } from 'react-router-dom';
import { useGetApps } from '@/hooks/api/apiApp/useGetApps';
import { useGetAuthorization } from '@/hooks/api/apiAuthorization/useGetAuthorization';
import { useGetRegions } from '@/hooks/api/apiCapabilities/useGetRegions';
import { useGetDatastores } from '@/hooks/api/apiDatastore/useGetDatastores';
import { useGetJobs } from '@/hooks/api/apiJob/useGetJobs';
import { useGetNotebooks } from '@/hooks/api/apiNotebook/useGetNotebooks';
import { useGetRegistries } from '@/hooks/api/apiRegistry/useGetRegistries';
import { useGetTokens } from '@/hooks/api/apiToken/useGetTokens';
import { useGetUsers } from '@/hooks/api/apiUser/useGetUsers';

export default function Home() {
  const { projectId } = useParams();
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

  const authorizatioQuery = useGetAuthorization(projectId);

  const datastoreQuery = useGetDatastores(projectId, 'GRA');

  console.log(notebooksQuery.data);
  console.log(jobsQuery.data);
  console.log(appsQuery.data);
  console.log(userQuery.data);
  console.log(tokenQuery.data);
  console.log(registriesQuery.data);
  console.log(regionsQuery.data);
  console.log(authorizatioQuery.data);
  console.log(datastoreQuery.data);
  return (
    <>
      <h1>AI Dashboard</h1>
    </>
  );
}
