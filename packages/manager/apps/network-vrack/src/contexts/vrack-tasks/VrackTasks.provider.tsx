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
  const [toBeTrackedTask, setToBeTrackedTask] = useState<TrackedTask[]>([]);

  const trackTask = (newTrackedTask: TrackedTask) =>
    setToBeTrackedTask((prev) => [...prev, newTrackedTask]);

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
    if (toBeTrackedTask.length === 0) return;

    const ready = toBeTrackedTask.filter(({ taskId }) =>
      vrackTasks.some(({ id }) => id === taskId),
    );
    const stillPending = toBeTrackedTask.filter(
      ({ taskId }) => !vrackTasks.some(({ id }) => id === taskId),
    );

    if (ready.length > 0) {
      setTrackedTasks((prev) => [...prev, ...ready]);
      setToBeTrackedTask(stillPending);
    }
  }, [toBeTrackedTask, vrackTasks]);

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
