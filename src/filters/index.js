import angular from 'angular';
import translate from 'angular-translate';

import tucCapitalizeFilter from './capitalize/capitalize.filter';
import tucDurationFilter from './duration/duration.filter';
import tucErrorMessageFilter from './errors/error-message.filter';
import tucFormatPriceFilter from './formatPrice/format-price.filter';
import tucMiddleTruncFilter from './middle-trunc/middle-trunc';
import tucPropsFilterFilter from './props/props.filter';
import tucReplaceFilter from './replace/replace.filter';
import tucSlugifyFilter from './slugify/slugify';
import tucSnakeCaseFilter from './snakeCase/snake-case.filter';
import tucWordsFilter from './words/words.filter';

const moduleName = 'tucFilters';

angular
  .module(moduleName, [
    translate,
  ])
  .filter('tucCapitalize', tucCapitalizeFilter)
  .filter('tucDuration', tucDurationFilter)
  .filter('tucErrorMessage', tucErrorMessageFilter)
  .filter('tucFormatPrice', tucFormatPriceFilter)
  .filter('tucMiddleTrunc', tucMiddleTruncFilter)
  .filter('tucPropsFilter', tucPropsFilterFilter)
  .filter('tucReplace', tucReplaceFilter)
  .filter('tucSlugify', tucSlugifyFilter)
  .filter('tucSnakeCase', tucSnakeCaseFilter)
  .filter('tucWords', tucWordsFilter);

export default moduleName;
