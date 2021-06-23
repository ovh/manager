import controller from './ip-ip-arp.controller';
import template from './ip-ip-arp.html';
import service from './ip-ip-arp.service';

const moduleName = 'ovhManagerIpArp';

angular
  .module(moduleName, [])
  .controller('IpViewArpCtrl', controller)
  .service('IpArp', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/arp/ip-ip-arp.html', template);
    },
  );

export default moduleName;
