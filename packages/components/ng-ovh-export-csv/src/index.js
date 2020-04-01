import angular from 'angular';
import service from './service';
import directive from './directive';

const moduleName = 'ngOvhExportCsv';

angular
  .module(moduleName, [])
  .service('exportCsv', service)
  .directive('exportCsv', directive);

export default moduleName;
