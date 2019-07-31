import angular from 'angular';
import translate from 'angular-translate';

import humanReadableSizeFilter from './humanReadableSize-filter';

const moduleName = 'ua.humanReadableSize';

angular
  .module(moduleName, [translate])
  .filter('humanReadableSize', humanReadableSizeFilter)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
