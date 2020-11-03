export default /* @ngInject */ ($stateProvider) => {
  [
    {
      abstract: true,
      name: 'app',
    },
    {
      abstract: true,
      name: 'app.account',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
