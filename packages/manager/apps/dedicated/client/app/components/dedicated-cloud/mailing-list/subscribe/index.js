import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-mailing-list-subscribe.component';
import service from './dedicatedCloud-mailing-list-subscribe.service';

const moduleName = 'ovhManagerPccMailingListSubscribe';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .service('dedicatedCloudMailingList', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
