/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';

import { useGetVrackTasks } from '@/hooks/tasks/useGetVrackTasks';
import { TrackedTask } from '@/types/Task.type';

import tasksContext from './vrack-tasks.context';

type Props = {
  serviceName: string;
  children: JSX.Element | JSX.Element[];
};

export const VrackTasksProvider = ({ serviceName, children }: Props): JSX.Element => {
  const { vrackTasks } = useGetVrackTasks({ serviceName });
  const [trackedTasks, setTrackedTasks] = useState<TrackedTask[]>([]);
  const [toBeTrackedTask, setToBeTrackedTask] = useState<TrackedTask | undefined>(undefined);

  const trackTask = (newTrackedTask: TrackedTask) => setToBeTrackedTask(newTrackedTask);

  const untrackTask = useCallback(
    (trackedTaskToBeRemoved: TrackedTask) => {
      const updatedTrackedTasks = trackedTasks.filter(
        ({ taskId }) => taskId !== trackedTaskToBeRemoved.taskId,
      );
      setTrackedTasks(updatedTrackedTasks);
    },
    [trackedTasks],
  );

  const context = {
    trackedTasks,
    trackTask,
  };

  useEffect(() => {
    if (
      toBeTrackedTask !== undefined &&
      vrackTasks.some(({ id }) => id === toBeTrackedTask?.taskId)
    ) {
      const updatedTrackedTasks = [...trackedTasks, toBeTrackedTask];
      setTrackedTasks(updatedTrackedTasks);
      setToBeTrackedTask(undefined);
    }
  }, [toBeTrackedTask, vrackTasks, trackedTasks]);

  useEffect(() => {
    const finishedTask = trackedTasks.find(
      ({ taskId }) => !vrackTasks.some(({ id }) => id === taskId),
    );
    if (finishedTask !== undefined) {
      finishedTask.onFinished();
      untrackTask(finishedTask);
    }
  }, [vrackTasks, trackedTasks, untrackTask]);

  return <tasksContext.Provider value={context}>{children}</tasksContext.Provider>;
};

export default VrackTasksProvider;
