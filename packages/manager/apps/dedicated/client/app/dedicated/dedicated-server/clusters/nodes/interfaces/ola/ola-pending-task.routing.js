const redirectTo = (transition) => {
  const injector = transition.injector();
  return injector
    .getAsync('serverName')
    .then((serverName) => {
      return injector
        .getAsync('olaService')
        .then((olaService) => olaService.getTasks(serverName))
        .then((tasks) =>
          tasks.filter(({ status }) =>
            ['todo', 'init', 'doing'].includes(status),
          ),
        );
    })
    .then((pendingTasks) => {
      return pendingTasks.length > 0
        ? 'app.dedicated-cluster.cluster.node.interfaces.ola-pending-task'
        : null;
    })
    .catch(() => null);
};

const routing = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.interfaces.ola-pending-task',
    {
      url: '/ola-pending-task',
      views: {
        'tabView@app.dedicated-cluster.cluster.node': {
          component: 'dedicatedServerInterfacesOlaPendingTask',
        },
      },
      resolve: {
        goToInterfaces: /* @ngInject */ ($state) => (params) =>
          $state.go('app.dedicated-cluster.cluster.node.interfaces', params, {
            reload: true,
          }),
      },
    },
  );
};

export { redirectTo, routing };
