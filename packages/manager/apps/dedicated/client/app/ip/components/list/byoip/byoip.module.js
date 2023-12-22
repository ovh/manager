import service from './ip-ip-byoip.service';

import sliceController from './slice/ip-ip-byoip-slice.controller';
import sliceTemplate from './slice/ip-ip-byoip-slice.html';

const moduleName = 'ovhManagerIpDashboardByoip';

angular
  .module(moduleName, [])
  .controller('IpSliceByoipCtrl', sliceController)
  .service('IpByoipService', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/byoip/slice/ip-ip-byoip-slice.html',
        sliceTemplate,
      );
    },
  );

export default moduleName;
