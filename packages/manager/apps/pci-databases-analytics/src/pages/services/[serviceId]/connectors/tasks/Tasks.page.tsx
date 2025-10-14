import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import {
  Alert,
  AlertTitle,
  Badge,
  Button,
  Code,
  java,
  Skeleton,
  useToast,
} from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import Link from '@/components/links/Link.component';
import { useGetConnectorTasks } from '@/hooks/api/database/connector/useGetConnectorTasks.hook';
import { useRestartTask } from '@/hooks/api/database/connector/useRestartTask.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetConnector } from '@/hooks/api/database/connector/useGetConnector.hook';
import { StatusEnum } from '@/types/cloud/project/database/kafkaConnect/connector/task/StatusEnum';
import { POLLING } from '@/configuration/polling.constants';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb-tasks"
      namespace="pci-databases-analytics/services/service/connectors"
    />
  );
}

const Tasks = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/connectors',
  );

  const { connectorId } = useParams();
  const { projectId, service } = useServiceData();
  const toast = useToast();

  const connectorQuery = useGetConnector(
    projectId,
    service.engine,
    service.id,
    connectorId,
    {
      enabled: !!connectorId,
    },
  );

  const tasksQuery = useGetConnectorTasks(
    projectId,
    service.engine,
    service.id,
    connectorId,
    {
      refetchInterval: POLLING.CONNECTOR_TASKS,
    },
  );

  const { restartTask } = useRestartTask({
    onError: (err) => {
      toast.toast({
        title: t('restartConnectorTaskToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('restartConnectorTaskToastSuccessTitle'),
      });
    },
  });

  const getTaskBadgeVariant = (status: StatusEnum) => {
    switch (status) {
      case StatusEnum.RUNNING:
        return 'success';
      case StatusEnum.FAILED:
        return 'destructive';
      case StatusEnum.PAUSED:
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <>
      <h2>{t('titleTasks')}</h2>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
      </Link>
      <h5 className="mt-2">
        {t('tasksDescription', {
          connectorName: connectorQuery.data?.name || '',
        })}
      </h5>
      <div className="flex flex-col gap-2">
        {!tasksQuery.data && (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        )}
        {tasksQuery.data?.length === 0 && (
          <Alert className="mt-4">
            <AlertTitle>{t('noTasksMessage')}</AlertTitle>
          </Alert>
        )}
        {tasksQuery.data?.map((task) => {
          return task.trace ? (
            <Code
              className="text-sm"
              label={
                <div className="flex flex-row items-center justify-between w-full">
                  <div>
                    <span>{t('taskLabel', { taskId: task.id })}</span>
                    <Badge
                      variant={getTaskBadgeVariant(task.status)}
                      className="ml-2"
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <Button
                    size="xs"
                    variant="neutral"
                    className="bg-neutral-700 hover:bg-neutral-800"
                    onClick={() =>
                      restartTask({
                        projectId,
                        engine: service.engine,
                        serviceId: service.id,
                        connectorId,
                        taskId: `${task.id}`,
                      })
                    }
                  >
                    <RefreshCcw className="size-3 mr-1" />
                    {t('restartTaskButtonLabel')}
                  </Button>
                </div>
              }
              code={task.trace}
              lang={java}
            ></Code>
          ) : (
            <div className="bg-neutral-700 text-neutral-200 flex flex-row justify-between w-full p-2 py-2 rounded-sm font-semibold text-sm">
              <div>
                <span>{t('taskLabel', { taskId: task.id })}</span>
                <Badge
                  variant={getTaskBadgeVariant(task.status)}
                  className="ml-2"
                >
                  {task.status}
                </Badge>
              </div>
              <Button
                size="xs"
                variant="neutral"
                className="bg-neutral-700 hover:bg-neutral-800"
                onClick={() =>
                  restartTask({
                    projectId,
                    engine: service.engine,
                    serviceId: service.id,
                    connectorId,
                    taskId: `${task.id}`,
                  })
                }
              >
                <RefreshCcw className="size-3 mr-1" />
                {t('restartTaskButtonLabel')}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Tasks;
