export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.resourceGroup', {
    abstract: true,
    url: '/resourceGroup',
  });
};
