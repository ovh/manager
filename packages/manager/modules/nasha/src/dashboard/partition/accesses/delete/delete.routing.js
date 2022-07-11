export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.accesses.delete', {
    url: '/:ip/delete',
    component: 'nashaComponentsPartitionAccessDelete',
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, trackTasks) => ({
        error,
        tasks,
        ...otherParams
      } = {}) =>
        tasks ? trackTasks({ ...otherParams, tasks }) : goBack({ error }),
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
    },
  });
};
