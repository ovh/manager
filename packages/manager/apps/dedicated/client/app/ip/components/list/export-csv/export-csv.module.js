import controller from './ip-ip-export-csv.controller';
import template from './ip-ip-export-csv.html';

const moduleName = 'ovhManagerExportCSV';

angular
  .module(moduleName, [])
  .controller('IpToCsvCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/export-csv/ip-ip-export-csv.html', template);
    },
  );

export default moduleName;
