import angular from 'angular';

import ducBytes from './bytes';
import ducContract from './contract';
import ducNotification from './notification';
import ducPrice from './price';
import ducTranslate from './translate';

const moduleName = 'dedicatedUniverseComponents';

angular.module(moduleName, [
  ducBytes,
  ducContract,
  ducNotification,
  ducPrice,
  ducTranslate,
]);

export default moduleName;
