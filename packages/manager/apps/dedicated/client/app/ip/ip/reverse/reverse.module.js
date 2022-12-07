import controller from './ip-ip-reverse.controller';
import service from './ip-ip-reverse.service';
import template from './ip-ip-reverse.html';

import addController from './add/ip-ip-reverse-add.controller';
import addTemplate from './add/ip-ip-reverse-add.html';
import deleteController from './delete/ip-ip-reverse-delete.controller';
import deleteTemplate from './delete/ip-ip-reverse-delete.html';
import updateController from './update/update.controller';
import updateTemplate from './update/ip-ip-reverse-update.html';

const moduleName = 'ovhManagerIpDashboardReverse';

angular
  .module(moduleName, [])
  .controller('IpIpv6ReverseDelegationCtrl', controller)
  .controller('IpAddIpv6Ctrl', addController)
  .controller('IpIpv6ReverseDelegationDeleteCtrl', deleteController)
  .controller('IpReverseUpdateCtrl', updateController)
  .service('IpReverse', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/reverse/ip-ip-reverse.html', template);
      $templateCache.put('ip/reverse/add/ip-ip-reverse-add.html', addTemplate);
      $templateCache.put(
        'ip/reverse/delete/ip-ip-reverse-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'ip/reverse/update/ip-ip-reverse-update.html',
        updateTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./update/translations */);

export default moduleName;
