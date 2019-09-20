import '@ovh-ux/manager-telecom-styles';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('spare.phones.order', {
    url: '/order',
    views: {
      'spareView@spare': 'phoneOrderComponent',
    },
    resolve: {
      brands: /* @ngInject */ OvhApiTelephony => OvhApiTelephony
        .Spare().v6().getBrands().$promise.then((brands) => {
          const spareBrands = [];
          brands.sort().forEach((element) => {
            spareBrands.push({
              id: element,
              name: element.replace(/\./g, ' ').toUpperCase(),
            });
          });
          return spareBrands;
        }),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
