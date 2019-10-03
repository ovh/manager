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
        .$promise.then(brands => brands.sort().map(element => ({
          id: element,
          name: element
            .replace('xdsl.', '')
            .replace(/\./g, ' ')
            .toUpperCase(),
        }))),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
