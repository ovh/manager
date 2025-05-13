export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policy', {
    abstract: true,
    url: '/policy',
  });
};
