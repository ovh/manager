export default /* @ngInject */ ($stateProvider) => {
  [
    {
      abstract: true,
      name: 'account',
    },
    {
      abstract: true,
      name: 'account.service',
      template: '<ui-view/>',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
