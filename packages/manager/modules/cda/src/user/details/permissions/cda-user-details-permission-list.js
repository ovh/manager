import listController from './cda-user-details-permission-list.controller';
import listTemplate from './cda-user-details-permission-list.html';
import permissionTemplate from './cda-user-details-permission-title.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'cda.dashboard.cda-user.cda-user-details.cda-user-details-permission-list',
    {
      url: '/permission/list',
      views: {
        cdaUserDetailsTitle: {
          template: permissionTemplate,
        },
        cdaUserDetailsContent: {
          template: listTemplate,
          controller: listController,
          controllerAs: 'CdaUserDetailsPermissionListCtrl',
        },
      },
      translations: {
        format: 'json',
        value: ['.'],
      },
    },
  );
};
