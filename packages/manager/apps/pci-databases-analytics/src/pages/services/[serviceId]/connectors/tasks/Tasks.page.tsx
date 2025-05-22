import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@ovh-ux/manager-core-api';
import { ArrowLeft } from 'lucide-react';
import { Badge, Code, java } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';
import Link from '@/components/links/Link.component';

const Tasks = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );

  const { connectorId } = useParams();
  const { projectId, service } = useServiceData();

  const tasksQuery = useQuery({
    queryKey: [
      projectId,
      'database',
      service.engine,
      service.id,
      'connector',
      connectorId,
      'tasks',
    ],
    queryFn: () =>
      apiClient.v6
        .get(
          `/cloud/project/${projectId}/database/${service.engine}/${service.id}/connector/${connectorId}/task`,
          {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Size': '50000',
              Pragma: 'no-cache',
            },
          },
        )
        .then((res) => res.data as database.kafkaConnect.connector.Task[]),
  });

  return (
    <>
      <h2>{t('title')}</h2>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
      </Link>
      <div className="flex flex-col gap-2">
        {tasksQuery.data?.map((task) => (
          <Code
            className="text-sm"
            label={
              <>
                Task n°{task.id} <Badge className="ml-2">{task.status}</Badge>
              </>
            }
            code={task.trace}
            lang={java}
          ></Code>
        ))}
      </div>
    </>
  );
};

export default Tasks;
