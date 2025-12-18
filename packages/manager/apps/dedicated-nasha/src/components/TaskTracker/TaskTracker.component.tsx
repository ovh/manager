import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Card,
  Message,
  MESSAGE_TYPE,
  Progress,
  Spinner,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getTask } from '@/api/nasha/nasha';
import type { NashaTask } from '@/types/nasha.type';

interface TaskTrackerProps {
  serviceName: string;
  tasks: NashaTask[];
  operation: string;
  params?: Record<string, string | number | undefined>;
  trackingData?: {
    prefix: string;
    hit: string;
  };
  onDone: (success: boolean, error?: string) => void;
  goBackUrl: string;
}

type TaskStatus = 'todo' | 'doing' | 'done' | 'error';

interface TrackedTask extends NashaTask {
  progress: number;
  statusMessage: string;
}

const POLL_INTERVAL = 2000; // 2 seconds

export const TaskTracker: React.FC<TaskTrackerProps> = ({
  serviceName,
  tasks: initialTasks,
  operation,
  params = {},
  trackingData,
  onDone,
  goBackUrl,
}) => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tracking } = React.useContext(ShellContext).shell;

  const [trackedTasks, setTrackedTasks] = useState<TrackedTask[]>(() =>
    initialTasks.map((task) => ({
      ...task,
      progress: 0,
      statusMessage: t(`nasha_components_task_tracker_status_${task.status}`),
    })),
  );
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const getProgressForStatus = (status: string): number => {
    switch (status) {
      case 'todo':
        return 0;
      case 'doing':
        return 50;
      case 'done':
        return 100;
      case 'error':
        return 100;
      default:
        return 0;
    }
  };

  const pollTasks = useCallback(async () => {
    try {
      const updatedTasks = await Promise.all(
        trackedTasks.map(async (task) => {
          if (task.status === 'done' || task.status === 'error') {
            return task;
          }
          try {
            const updatedTask = await getTask(serviceName, task.taskId);
            return {
              ...updatedTask,
              progress: getProgressForStatus(updatedTask.status),
              statusMessage: t(
                `nasha_components_task_tracker_status_${updatedTask.status}`,
              ),
            };
          } catch (err) {
            return {
              ...task,
              status: 'error',
              progress: 100,
              statusMessage: t('nasha_components_task_tracker_status_error'),
            };
          }
        }),
      );

      setTrackedTasks(updatedTasks);

      // Check if all tasks are complete
      const allDone = updatedTasks.every(
        (task) => task.status === 'done' || task.status === 'error',
      );
      const anyError = updatedTasks.some((task) => task.status === 'error');

      if (allDone) {
        setIsComplete(true);
        setHasError(anyError);
        if (anyError) {
          const errorTask = updatedTasks.find((task) => task.status === 'error');
          setErrorMessage(errorTask?.details);
        }
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage((err as Error).message);
    }
  }, [trackedTasks, serviceName, t]);

  useEffect(() => {
    if (!isComplete) {
      const interval = setInterval(pollTasks, POLL_INTERVAL);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [pollTasks, isComplete]);

  // Initial poll
  useEffect(() => {
    pollTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (trackingData) {
      tracking?.trackClick({
        name: `${trackingData.prefix}::${trackingData.hit}`,
        type: 'action',
      });
    }

    // Invalidate queries to refresh data
    queryClient.invalidateQueries();

    if (isComplete) {
      onDone(!hasError, errorMessage);
    }

    navigate(goBackUrl);
  };

  const overallProgress = trackedTasks.reduce(
    (sum, task) => sum + task.progress,
    0,
  ) / trackedTasks.length;

  return (
    <div className="p-4">
      <Card className="p-6">
        <Text preset={TEXT_PRESET.heading4} className="mb-4">
          {t(`nasha_components_task_tracker_operation_${operation}`)}
        </Text>

        {/* Warning message */}
        <Message type={MESSAGE_TYPE.warning} className="mb-4">
          {t('nasha_components_task_tracker_warning')}
        </Message>

        {/* Task parameters */}
        <div className="mb-4">
          {Object.entries(params).map(([key, value]) =>
            value ? (
              <Text key={key} preset={TEXT_PRESET.paragraph} className="font-semibold block">
                {t(`nasha_components_task_tracker_param_${key}`, params)}
              </Text>
            ) : null,
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          {!isComplete ? (
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <div className="flex-1">
                <Progress value={overallProgress} max={100} />
              </div>
              <Text preset={TEXT_PRESET.paragraph}>
                {Math.round(overallProgress)}%
              </Text>
            </div>
          ) : (
            <Message
              type={hasError ? MESSAGE_TYPE.error : MESSAGE_TYPE.success}
              className="mb-4"
            >
              {hasError
                ? t(`nasha_components_task_tracker_operation_${operation}_error`, {
                    ...params,
                    error: errorMessage,
                  })
                : t(`nasha_components_task_tracker_operation_${operation}_success`, params)}
            </Message>
          )}
        </div>

        {/* Tasks list */}
        <div className="mb-4">
          {trackedTasks.map((task) => (
            <div
              key={task.taskId}
              className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                {task.status === 'doing' && <Spinner size="sm" />}
                {task.status === 'done' && (
                  <span className="text-green-500">✓</span>
                )}
                {task.status === 'error' && (
                  <span className="text-red-500">✗</span>
                )}
                {task.status === 'todo' && (
                  <span className="text-gray-400">○</span>
                )}
                <Text preset={TEXT_PRESET.paragraph}>
                  {t(`nasha_components_task_tracker_operation_${task.operation}`)}
                </Text>
              </div>
              <Text preset={TEXT_PRESET.caption} className="text-gray-500">
                {task.statusMessage}
              </Text>
            </div>
          ))}
        </div>

        {/* Close button */}
        <div className="flex justify-end">
          <Button
            color={BUTTON_COLOR.primary}
            variant={isComplete ? BUTTON_VARIANT.default : BUTTON_VARIANT.outline}
            onClick={handleClose}
          >
            {isComplete
              ? t('nasha_components_task_tracker_close')
              : t('nasha_components_task_tracker_run_background')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TaskTracker;

