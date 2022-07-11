export const createTaskTrackerStateOptions = (queryParams = []) => ({
  url: `/track-tasks?${['taskIds'].concat(queryParams).join('&')}`,
  component: 'nashaComponentsTaskTracker',
  params: {
    tasks: null,
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
    endpoint: /* @ngInject */ (serviceName) =>
      `/dedicated/nasha/${serviceName}/task`,
    operation: /* @ngInject */ (tasks) => tasks[0].operation,
    params: /* @ngInject */ ($transition$) => {
      const params = $transition$.params();
      return Object.keys(params)
        .filter((key) => queryParams.includes(key))
        .reduce((set, key) => ({ ...set, [key]: params[key] }), {});
    },
    tasks: /* @ngInject */ ($transition$, endpoint, TaskTrackerService) =>
      $transition$.params().tasks ||
      TaskTrackerService.getTasks(
        endpoint,
        $transition$.params().taskIds.split(','),
      ),
  },
});

export default {
  createTaskTrackerStateOptions,
};
