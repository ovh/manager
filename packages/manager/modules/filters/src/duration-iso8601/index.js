import angular from 'angular';
import translate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import durationISO8601Filter from './duration-iso8601.filter';

const moduleName = 'durationISO8601';

angular
  .module(moduleName, [ngTranslateAsyncLoader, translate])
  .filter('durationISO8601', durationISO8601Filter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
