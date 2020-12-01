export default /* @ngInject */ ($stateProvider) => {
  [
    {
      abstract: true,
      name: 'app',
    },
    {
      abstract: true,
      name: 'app.billing',
    },
  ].forEach((state) => $stateProvider.state(state.name, state));
};
