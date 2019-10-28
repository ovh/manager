import detailComponent from './detail/vps-detail.component';
import headerComponent from './header/vps-header.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('iaas.vps', {
      url: '/vps',
      templateUrl: 'app/vps/vps.html',
      abstract: true,
      resolve: {
        currentUser: /* @ngInject */ OvhApiMe => OvhApiMe.v6().get().$promise,
      },
      translations: {
        value: ['../common', '../vps'],
        format: 'json',
      },
    })
    .state('iaas.vps.detail', {
      url: '/{serviceName}',
      redirectTo: 'iaas.vps.detail.dashboard',
      resolve: {
        capabilities: /* @ngInject */ (
          serviceName,
          OvhApiVpsCapabilities,
        ) => OvhApiVpsCapabilities.Aapi().query({ serviceName }).$promise
          .then(capabilities => capabilities.map(capability => _.kebabCase(capability))),
        serviceName: /* @ngInject */ $transition$ => $transition$.params().serviceName,
        stateVps: /* @ngInject */ ($q, serviceName, OvhApiVps) => OvhApiVps.v6().get({
          serviceName,
        }).$promise
          .then(stateVps => OvhApiVps.v6().version({
            serviceName,
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
