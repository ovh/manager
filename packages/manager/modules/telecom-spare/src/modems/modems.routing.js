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
      deleteSpare: /* @ngInject */ $state => spare => $state.go('spare.modems.delete', {
        spare: spare.spare,
      }),
      replaceSpare: /* @ngInject */ $state => spare => $state.go('spare.modems.replace', {
        spare: spare.spare,
      }),
      returnMerchandise: /* @ngInject */ $state => spare => $state.go('spare.modems.return', {
        spare: spare.spare,
      }),
      orderNewModem: /* @ngInject */ $state => () => $state.go('spare.modems.order'),
      goToModems: /* @ngInject */ ($state, TucToast) => (message = false, type = 'success') => {
        const reload = message && type === 'success';
        const promise = $state.go('spare.modems', {}, {
          reload,
        });

        if (message) {
          promise.then(() => {
            TucToast[type](message);
          });
        }

        return promise;
      },
    },
  });
};
