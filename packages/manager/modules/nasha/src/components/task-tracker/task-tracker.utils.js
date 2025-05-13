export const createTaskTrackerStateOptions = (queryParams = []) => ({
  url: `/track-tasks?${['taskIds'].concat(queryParams).join('&')}`,
  component: 'nashaComponentsTaskTracker',
  params: {
    tasks: null,
    trackingData: null,
  },
  redirectTo: (transition) => {
    const params = transition.params();
    if (!params.taskIds) {
      return {
        state: transition.targetState().name(),
        params: {
          ...params,
          taskIds: params.tasks.map(({ taskId }) => taskId).join(','),
        },
      };
    }
    return false;
  },
  resolve: {
    operation: /* @ngInject */ (tasks) => tasks[0].operation,
    params: /* @ngInject */ ($transition$) => {
      const params = $transition$.params();
      return Object.keys(params)
        .filter((key) => queryParams.includes(key))
        .reduce((set, key) => ({ ...set, [key]: params[key] }), {});
    },
    trackingData: /* @ngInject */ ($transition$) =>
      $transition$.params().trackingData,
    tasks: /* @ngInject */ ($transition$, taskApiUrl, TaskTrackerService) =>
      $transition$.params().tasks ||
      TaskTrackerService.getTasks(
        taskApiUrl,
        $transition$.params().taskIds.split(','),
      ),
  },
});

export default {
  createTaskTrackerStateOptions,
};
