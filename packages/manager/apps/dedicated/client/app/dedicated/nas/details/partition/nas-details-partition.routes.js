angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.dedicated-nas.details.partition', {
      url: '/partitions',
      views: {
        nasDetails: {
          templateUrl:
            'dedicated/nas/details/partition/nas-details-partition.html',
          controller: 'PartitionCtrl',
          controllerAs: '$ctrl',
        },
      },
      reloadOnSearch: false,
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('nas_details_partition'),
      },
    });

    $stateProvider.state('app.dedicated-nas.details.partition.dashboard', {
      url: '/:partitionName',
      template: '<div ui-view></div>',
      redirectTo: 'app.dedicated-nas.details.partition',
      resolve: {
        partitionName: /* @ngInject */ ($transition$) =>
          $transition$.params().partitionName,
        breadcrumb: /* @ngInject */ (partitionName) => partitionName,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
