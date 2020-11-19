import template from './phone.html';
import controller from './phone.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone',
    {
      url: '/phone',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_phone_actions_line_details_phone_breadcrumb',
          ),
      },
    },
  );
};
