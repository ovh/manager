import angular from 'angular';
import translate from 'angular-translate';

import tucUnitHumanizeFilter from './unit-humanize.filter';

const moduleName = 'tucUnitHumanize';

angular
  .module(moduleName, [translate])
  .filter('tuc-unit-humanize', tucUnitHumanizeFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
