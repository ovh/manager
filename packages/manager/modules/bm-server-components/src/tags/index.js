import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';
import assignTags from './assignTags';
import unassignTags from './unassignTags';

const moduleName = 'ovhManagerBmServerComponentsTagsComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    assignTags,
    unassignTags,
  ])
  .component('serverTags', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
