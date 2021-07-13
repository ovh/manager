import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';
import ducNotification from './notification';
import ducPrice from './price';
import ducTranslate from './translate';

const moduleName = 'dedicatedUniverseComponents';

angular.module(moduleName, [
  ducBandwidth,
  ducBytes,
  ducNotification,
  ducPrice,
  ducTranslate,
]);

export default moduleName;
