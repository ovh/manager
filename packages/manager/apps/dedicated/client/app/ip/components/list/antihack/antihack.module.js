import controller from './ip-ip-antihack.controller';
import template from './ip-ip-antihack.html';
import service from './ip-ip-antihack.service';

const moduleName = 'ovhManagerIpAntihack';

angular
  .module(moduleName, [])
  .controller('IpViewAntihackCtrl', controller)
  .service('IpAntihack', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/antihack/ip-ip-antihack.html', template);
    },
  );

export default moduleName;
