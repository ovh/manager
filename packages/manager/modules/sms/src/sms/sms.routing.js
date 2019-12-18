import { FeatureAvailability } from '@ovh-ux/ng-ovh-telecom-universe-components';
import { SMS_AVAILABILITY } from '../feature-availability/feature-availability.constants';

import controller from './telecom-sms.controller';
import smsView from './telecom-sms.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service', {
    url: '/:serviceName',
    views: {
      '': {
        template: smsView,
        controller,
        controllerAs: 'TelecomSmsCtrl',
      },
    },
    abstract: true,
    resolve: {
      initSms: ($q, $stateParams, TucSmsMediator) => {
        // init sms services
        TucSmsMediator.initAll().then((smsDetails) => TucSmsMediator
          .setCurrentSmsService(smsDetails[$stateParams.serviceName]));
        return $q.when({ init: true });
      },
      smsFeatureAvailability: /* @ngInject */ (user) => new FeatureAvailability(
        user,
        SMS_AVAILABILITY,
      ),
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      $title: (translations, $translate, OvhApiSms, $stateParams) => OvhApiSms.v6()
        .get({
          serviceName: $stateParams.serviceName,
        }).$promise
        .then((data) => $translate.instant('sms_page_title', { name: data.description || $stateParams.serviceName }, null, null, 'escape'))
        .catch(() => $translate('sms_page_title', { name: $stateParams.serviceName })),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
