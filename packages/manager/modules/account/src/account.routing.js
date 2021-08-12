export default /* @ngInject */ ($stateProvider) => {
  [
    {
      abstract: true,
      name: 'app.account',
    },
    {
      abstract: true,
      name: 'app.account.service',
      template: '<ui-view/>',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
