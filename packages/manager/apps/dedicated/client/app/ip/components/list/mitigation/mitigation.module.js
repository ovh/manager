import service from './ip-ip-mitigation.service';
import updateController from './update/ip-ip-mitigation-update.controller';
import updateTemplate from './update/ip-ip-mitigation-update.html';

const moduleName = 'ovhManagerIpDashboardMitigation';

angular
  .module(moduleName, [])
  .controller('IpMitigationUpdateCtrl', updateController)
  .service('IpMitigation', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/mitigation/update/ip-ip-mitigation-update.html',
        updateTemplate,
      );
    },
  );

export default moduleName;
