import angular from 'angular';
import translate from 'angular-translate';

import contractsDirective from './contracts-directive';

import './contracts.css';

const moduleName = 'ua.contracts';

angular
  .module(moduleName, [translate])
  .directive('contracts', contractsDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
