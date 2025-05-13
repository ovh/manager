import template from './add-group.html';
import controller from './add-group.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.addGroup',
    {
      url: '/addGroup',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          template,
          controller,
          controllerAs: 'AddGroupCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_add_group_title'),
      },
    },
  );
};
