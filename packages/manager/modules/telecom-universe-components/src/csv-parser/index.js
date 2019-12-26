import angular from 'angular';

import TucCsvParser from './csv-parser.service';

const moduleName = 'tucCsvParser';

angular.module(moduleName, []).service('TucCsvParser', TucCsvParser);

export default moduleName;
