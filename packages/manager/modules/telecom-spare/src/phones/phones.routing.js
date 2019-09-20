import map from 'lodash/map';

import '@ovh-ux/manager-telecom-styles';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('spare.phones', {
    url: '/phones',
    views: {
      spareInnerView: 'phonesComponent',
    },
    resolve: {
      phones: /* @ngInject */ OvhApiTelephony => OvhApiTelephony.Spare()
        .v6()
        .query()
        .$promise.then(phones => map(phones, spare => ({ spare }))),
    },
  });
};
