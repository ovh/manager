import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { BaseLayout } from '@ovh-ux/muk';

import TaskTracker from '@/components/task-tracker/TaskTracker.component';

export default function TaskTrackerPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { taskId, operation, params, taskApiUrl } =
    (location.state as {
      taskId: number | string;
      operation: string;
      params?: Record<string, string | number>;
      taskApiUrl: string;
    }) || {};

  const handleGoBack = (options?: { success?: string; error?: string; reload?: boolean }) => {
    if (options?.reload) {
      // Navigate back to partitions list and reload data using relative path
      void navigate('..', {
        replace: true,
        state: options,
      });
    } else {
      void navigate(-1);
    }
  };

  if (!taskId || !operation || !taskApiUrl) {
    return (
      <BaseLayout
        header={{
          title: 'Error',
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
      }}
    >
      <div className="mb-4 text-sm text-gray-600">{serviceName}</div>
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
