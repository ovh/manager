import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import directive from './directive';
import './style.scss';

const moduleName = 'ovhManagerSelectCheckboxesComponent';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', 'ngSanitize'])
  .directive('selectCheckboxes', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
