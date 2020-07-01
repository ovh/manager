const commonResolve = {
  service: /* @ngInject */ (OvhApiOverTheBox, serviceName) =>
    OvhApiOverTheBox.v6()
      .get({ serviceName })
      .$promise.then((service) => service),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox', {
    url: '/:serviceName',
    abstract: true,
    component: 'ovhManagerOverTheBoxComponent',
    translations: {
      value: ['.', './details', './warning', './remote'],
      format: 'json',
    },
    resolve: {
      ...commonResolve,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      $title(translations, $translate, $stateParams, OvhApiOverTheBox) {
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
    },
  });
};
