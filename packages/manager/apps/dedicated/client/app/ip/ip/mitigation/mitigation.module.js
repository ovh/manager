import service from './ip-ip-mitigation.service';
import statisticsController from './statistics/ip-ip-mitigation-statistics.controller';
import statisticsTemplate from './statistics/ip-ip-mitigation-statistics.html';
import updateController from './update/ip-ip-mitigation-update.controller';
import updateTemplate from './update/ip-ip-mitigation-update.html';

const moduleName = 'ovhManagerIpDashboardMitigation';

angular
  .module(moduleName, [])
  .controller('IpMitigationStatisticsCtrl', statisticsController)
  .controller('IpMitigationUpdateCtrl', updateController)
  .service('IpMitigation', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/mitigation/statistics/ip-ip-mitigation-statistics.html',
        statisticsTemplate,
      );
      $templateCache.put(
        'ip/mitigation/update/ip-ip-mitigation-update.html',
        updateTemplate,
      );
    },
  );

export default moduleName;
