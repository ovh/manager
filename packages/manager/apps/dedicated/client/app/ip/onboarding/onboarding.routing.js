export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.onboarding', {
    url: '/onboarding',
    views: {
      'ipview@app.ip': 'ipOnboarding',
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('hasAnyIp')
        .then((hasAnyIp) => (hasAnyIp ? 'app.ip' : false)),
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
