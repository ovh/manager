import controller from './cda-user-details-permission-list-edit.controller';
import template from './cda-user-details-permission-list-edit.html';

import './cda-user-details-permission-list-edit.less';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'cda.dashboard.cda-details.cda-user.cda-user-details.cda-user-details-permission-list.cda-user-details-permission-list-edit',
    {
      url: '/edit',
      views: {
        'cdaDetails@cda': {
          template,
          controller,
          controllerAs: 'CdaUserDetailsPermissionListEditCtrl',
        },
      },
      translations: {
        format: 'json',
        value: ['.'],
      },
    },
  );
};
