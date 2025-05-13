import angular from 'angular';
import translate from 'angular-translate';

import ducTranslateAltFilter from './translate-alt.filter';

const moduleName = 'ducTranslate';

angular
  .module(moduleName, [translate])
  .filter('ducTranslateAlt', ducTranslateAltFilter);

export default moduleName;
