export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident', {
    url: 'incident/:incidentName',
    abstract: true,
    resolve: {
      incidentName: /* @ngInject */ ($transition$) =>
        $transition$.params().incidentName.toLowerCase(),
      servicesStatus: /* @ngInject */ ($http) =>
        $http
          .get('/incident-status', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data)
          .catch(() => []),
    },
  });
};
