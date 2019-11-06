import template from './template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('nasha.nasha-partition-access', {
      url: '/access/:partitionName',
      views: {
        nashaPartitionAccess: {
          template,
          controller: 'NashaPartitionAccessCtrl',
          controllerAs: 'NashaPartitionAccessCtrl',
        },
      },
      translations: {
        value: ['../../../common', '.'],
        format: 'json',
      },
    });
};
