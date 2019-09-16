import get from 'lodash/get';

import detailComponent from './detail/vps-detail.component';
import headerComponent from './header/vps-header.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('iaas.vps', {
      url: '/vps',
      templateUrl: 'app/vps/vps.html',
      abstract: true,
      translations: {
        value: ['../common', '../vps'],
        format: 'json',
      },
    })
    .state('iaas.vps.detail', {
      url: '/{serviceName}',
      redirectTo: 'iaas.vps.detail.dashboard',
      resolve: {
        stateVps: /* @ngInject */ ($transition$, $q, OvhApiVps) => OvhApiVps.v6().get({
          serviceName: get($transition$.params(), 'serviceName'),
        }).$promise
          .then(stateVps => OvhApiVps.v6().version({
            serviceName: get($transition$.params(), 'serviceName'),
          }).$promise.then((response) => {
            const vpsState = stateVps;
            vpsState.isLegacy = response.version !== 2;
            return vpsState;
          }))
          .catch((error) => {
            if (error.status === 404) {
              return $q.reject(error);
            }
            return true;
          }),
      },
      views: {
        'vpsHeader@iaas.vps': {
          component: headerComponent.name,
        },
        'vpsContainer@iaas.vps': {
          component: detailComponent.name,
        },
      },
    });
};
