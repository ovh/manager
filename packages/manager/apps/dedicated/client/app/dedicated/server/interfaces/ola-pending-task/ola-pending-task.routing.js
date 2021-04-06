import filter from 'lodash/filter';

const redirectTo = (transition) => {
  const injector = transition.injector();
  return injector
    .getAsync('serverName')
    .then((serverName) => {
      return injector
        .getAsync('DedicatedServerInterfacesService')
        .then((DedicatedServerInterfacesService) =>
          DedicatedServerInterfacesService.getTasks(serverName),
        )
        .then((tasks) => {
          const pendingTasks = filter(tasks, ({ status }) => {
            return ['todo', 'init', 'doing'].includes(status);
          });
          return pendingTasks;
        });
    })
    .then((pendingTasks) => {
      return pendingTasks.length > 0
        ? 'app.dedicated-server.server.interfaces.ola-pending-task'
        : null;
    })
    .catch(() => null);
};

const routing = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.interfaces.ola-pending-task',
    {
      url: '/ola-pending-task',
      views: {
        'tabView@app.dedicated-server.server': {
          component: 'dedicatedServerInterfacesOlaPendingTask',
        },
      },
      resolve: {
        goToInterfaces: /* @ngInject */ ($state) => (params) =>
          $state.go('app.dedicated-server.server.interfaces', params, {
            reload: true,
          }),
      },
    },
  );
};

export { redirectTo, routing };
