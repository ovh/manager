import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import './index.scss';

import component from './vps-outperform-banner.component';

const moduleName = 'ovhManagerBillingVpsOutperformBanner';

angular
  .module(moduleName, ['pascalprecht.translate', 'ngTranslateAsyncLoader'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
