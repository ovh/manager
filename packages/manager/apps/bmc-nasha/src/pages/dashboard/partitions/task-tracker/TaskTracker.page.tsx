import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { BaseLayout } from '@ovh-ux/muk';

import { urls } from '@/routes/Routes.constants';

import TaskTracker from '@/components/TaskTracker/TaskTracker.component';

export default function TaskTrackerPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { taskId, operation, params, taskApiUrl } = (location.state as {
    taskId: number | string;
    operation: string;
    params?: Record<string, string | number>;
    taskApiUrl: string;
  }) || {};

  const handleGoBack = (options?: { success?: string; error?: string; reload?: boolean }) => {
    if (options?.reload) {
      // Navigate back and reload data
      navigate(`../${urls.partitions.replace(':serviceName', serviceName ?? '')}`, {
        replace: true,
        state: options,
      });
    } else {
      navigate(-1);
    }
  };

  if (!taskId || !operation || !taskApiUrl) {
    return (
      <BaseLayout
        header={{
          title: 'Error',
          description: 'Missing task information',
        }}
      >
        <div>Invalid task tracker state</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      header={{
        title: 'Task in progress',
        description: serviceName,
      }}
    >
      <TaskTracker
        taskApiUrl={taskApiUrl}
        taskId={taskId}
        operation={operation}
        params={params}
        goBack={handleGoBack}
      />
    </BaseLayout>
  );
}

