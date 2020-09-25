import template from './dedicated-housing-backup.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicated-housing.dashboard.backup', {
    url: '/backup',
    template,
    controller: 'HousingFtpBackupCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('housing_backup'),
    },
  });
};
