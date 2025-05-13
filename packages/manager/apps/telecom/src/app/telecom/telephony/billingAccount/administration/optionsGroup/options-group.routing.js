import template from './options-group.html';
import controller from './options-group.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.optionsGroup',
    {
      url: '/optionsGroup',
      views: {
        'groupInnerView@telecom.telephony.billingAccount': {
          template,
          controller,
          controllerAs: 'OptionsGroupCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_options_group_title'),
      },
    },
  );
};
