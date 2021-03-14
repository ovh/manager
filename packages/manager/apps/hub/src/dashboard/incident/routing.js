export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.incident', {
    url: 'incident/:incidentName',
    abstract: true,
    resolve: {
      incidentName: /* @ngInject */ ($transition$) =>
        $transition$.params().incidentName.toLowerCase(),
    },
  });
};
