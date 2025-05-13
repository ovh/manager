export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam.schedule-backup', {
    url: '/schedule-backup',
    views: {
      modal: {
        component: 'vpsVeeamScheduleBackup',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
