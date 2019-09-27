import '@ovh-ux/manager-telecom-styles';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('spare.modems.order', {
    url: '/order',
    views: {
      'spareView@spare': 'modemOrderComponent',
    },
    resolve: {
      brands: /* @ngInject */ OvhApiXdsl => OvhApiXdsl.Spare()
        .v6()
        .getBrands()
        .$promise.then((brands) => {
          const spareBrands = [];
          brands.sort().forEach((element) => {
            spareBrands.push({
              id: element,
              name: element
                .replace('xdsl.', '')
                .replace(/\./g, ' ')
                .toUpperCase(),
            });
          });
          return spareBrands;
        }),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
