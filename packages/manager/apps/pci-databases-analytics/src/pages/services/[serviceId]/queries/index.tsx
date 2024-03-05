import { H2, P } from '@/components/typography';
import { useServiceData } from '../layout';
import { database } from '@/models/database';
import CurrentQueries from './_components/currentQueries';
import QueryStatistics from './_components/queryStatistics';

export function breadcrumb() {
  return 'Queries';
}

const Queries = () => {
  const { service } = useServiceData();
  return (
    <>
      <H2 className="mb-2">Queries</H2>
      {service.capabilities.currentQueries?.read ===
        database.service.capability.StateEnum.enabled && <CurrentQueries />}
      {service.capabilities.queryStatistics?.read ===
        database.service.capability.StateEnum.enabled && <QueryStatistics />}
    </>
  );
};

export default Queries;
