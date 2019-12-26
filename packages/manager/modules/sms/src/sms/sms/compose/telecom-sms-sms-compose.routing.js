import { name as componentName } from './telecom-sms-sms-compose.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.sms.compose', {
    url: '/compose',
    views: {
      'smsView@sms.service': componentName,
    },
    resolve: {
      sendersLink: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.senders'),
    },
  });
};
