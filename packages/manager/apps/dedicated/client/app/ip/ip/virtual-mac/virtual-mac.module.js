import controller from './ip-ip-virtual-mac.controller';
import service from './ip-ip-virtual-mac.service';
import template from './ip-ip-virtual-mac.html';

import addController from './add/ip-ip-virtual-mac-add.controller';
import addTemplate from './add/ip-ip-virtual-mac-add.html';
import deleteController from './delete/ip-ip-virtual-mac-delete.controller';
import deleteTemplate from './delete/ip-ip-virtual-mac-delete.html';

const moduleName = 'ovhManagerIpDashboardVirtualMac';

angular
  .module(moduleName, [])
  .controller('IpViewVirtualMacCtrl', controller)
  .controller('IpAddVirtualMacCtrl', addController)
  .controller('IpDeleteVirtualMacCtrl', deleteController)
  .service('IpVirtualMac', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/virtual-mac/ip-ip-virtual-mac.html', template);
      $templateCache.put(
        'ip/virtual-mac/add/ip-ip-virtual-mac-add.html',
        addTemplate,
      );
      $templateCache.put(
        'ip/virtual-mac/delete/ip-ip-virtual-mac-delete.html',
        deleteTemplate,
      );
    },
  );

export default moduleName;
