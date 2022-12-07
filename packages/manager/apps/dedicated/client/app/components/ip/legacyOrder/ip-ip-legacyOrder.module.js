import controller from './ip-ip-legacyOrder.controller';
import migrateController from './migrate/ip-ip-legacyOrder-migrate.controller';
import service from './ip-ip-legacyOrder.service';

import dedicatedTemplate from './DEDICATED.html';
import durationPccTemplate from './durationsPCC.html';
import durationTemplate from './durations.html';
import legacyOrderTemplate from './ip-ip-legacyOrder.html';
import legacyOrderMigrateTemplate from './migrate/ip-ip-legacyOrder-migrate.html';
import pccTemplate from './PCC.html';
import vpsTemplate from './VPS.html';

const moduleName = 'ovhManagerIpDashboardLegacyOrder';

angular
  .module(moduleName, [])
  .controller('IpLegacyOrderCtrl', controller)
  .controller('IpLegacyOrderMigrateController', migrateController)
  .service('IpLegacyOrder', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/ip/legacyOrder/DEDICATED.html', dedicatedTemplate);
      $templateCache.put(
        'ip/ip/legacyOrder/durationsPCC.html',
        durationPccTemplate,
      );
      $templateCache.put('ip/ip/legacyOrder/durations.html', durationTemplate);
      $templateCache.put(
        'ip/ip/legacyOrder/ip-ip-legacyOrder.html',
        legacyOrderTemplate,
      );
      $templateCache.put(
        'ip/ip/legacyOrder/migrate/ip-ip-legacyOrder-migrate.html',
        legacyOrderMigrateTemplate,
      );
      $templateCache.put('ip/ip/legacyOrder/PCC.html', pccTemplate);
      $templateCache.put('ip/ip/legacyOrder/VPS.html', vpsTemplate);
    },
  );

export default moduleName;
