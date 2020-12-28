import template from './tollfree-history.html';
import controller from './tollfree-history.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.billing.tollfree-history',
    {
      url: '/tollfree-history',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          controller,
          controllerAs: 'TollfreeHistoryCtrl',
        },
      },
    },
  );
};
