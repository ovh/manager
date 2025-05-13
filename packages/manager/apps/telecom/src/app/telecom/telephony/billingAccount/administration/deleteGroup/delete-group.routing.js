import template from './delete-group.html';
import controller from './delete-group.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.deleteGroup',
    {
      url: '/deleteGroup',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          template,
          controller,
          controllerAs: 'DeleteGroupCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_delete_group_title'),
      },
    },
  );
};
