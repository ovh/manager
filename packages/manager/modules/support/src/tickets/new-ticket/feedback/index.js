import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './feedback.component';
import service from './feedback.service';

const moduleName = 'ovhManagerSupportTicketsNewFeedback';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('supportTicketsNewFeedback', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('FeedbackService', service);

export default moduleName;
