import { name as componentName } from './telecom-sms-sms-compose.component';

import { MANAGE_CREDITS_HIT } from './telecom-sms-sms-compose.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.sms.compose', {
    url: '/compose',
    views: {
      'smsView@sms.service': componentName,
    },
    resolve: {
      goToOrder: /* @ngInject */ ($state, trackClick) => () => {
        trackClick(MANAGE_CREDITS_HIT);
        return $state.go('sms.service.order');
      },
      sendersLink: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.senders'),
    },
  });
};
