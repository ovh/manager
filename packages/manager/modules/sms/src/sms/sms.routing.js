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
      batches: /* @ngInject */ (getBatches) => getBatches(),
      getBatches: /* @ngInject */ ($http, serviceName) => () =>
        $http
          .get(`/sms/${serviceName}/batches`)
          .then(({ data }) =>
            data.sort(
              (batchA, batchB) =>
                new Date(batchB.createdAt) - new Date(batchA.createdAt),
            ),
          )
          .catch(() => []),
      initSms: ($q, $stateParams, TucSmsMediator) => {
        // init sms services
        TucSmsMediator.initAll().then((smsDetails) =>
          TucSmsMediator.setCurrentSmsService(
            smsDetails[$stateParams.serviceName],
          ),
        );
        return $q.when({ init: true });
      },
      service: /* @ngInject */ ($http, serviceName) =>
        $http.get(`/sms/${serviceName}`).then(({ data: service }) => service),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      smsFeatureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability([
          'sms:hlr',
          'sms:response',
        ]),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      $title: /* @ngInject */ ($translate, service) =>
        $translate.instant(
          'sms_page_title',
          { name: service.description || service.serviceName },
          null,
          null,
          'escape',
        ),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
