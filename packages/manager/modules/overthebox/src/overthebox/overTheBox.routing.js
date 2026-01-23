import { FEATURES } from './overTheBox.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox', {
    url: '/:serviceName',
    redirectTo: 'overTheBoxes.overTheBox.details',
    component: 'ovhManagerOverTheBoxComponent',
    resolve: {
      service: /* @ngInject */ (OvhApiOverTheBox, $stateParams) =>
        OvhApiOverTheBox.v6()
          .get({ serviceName: $stateParams.serviceName })
          .$promise.then((service) => service),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      $title: /* @ngInject */ (
        translations,
        $translate,
        $stateParams,
        OvhApiOverTheBox,
      ) => {
        return OvhApiOverTheBox.v6()
          .get({
            serviceName: $stateParams.serviceName,
          })
          .$promise.then((data) =>
            $translate.instant(
              'overTheBox_page_title',
              { name: data.customerDescription || $stateParams.serviceName },
              null,
              null,
              'escape',
            ),
          )
          .catch(() =>
            $translate('overTheBox_page_title', {
              name: $stateParams.serviceName,
            }),
          );
      },
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability(Object.values(FEATURES)),
    },
    translations: {
      value: ['.', './details', './warning', './remote'],
      format: 'json',
    },
  });
};
