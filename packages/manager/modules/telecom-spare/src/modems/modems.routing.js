import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('spare.modems', {
    url: '/modems',
    views: {
      spareInnerView: 'modemsComponent',
    },
    resolve: {
      modems: /* @ngInject */ OvhApiXdsl => OvhApiXdsl.Spare()
        .v6()
        .query()
        .$promise.then(modems => map(modems, spare => ({ spare }))),

    },
  });
};
