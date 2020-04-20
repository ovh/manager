import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';
import shortcutTile from './shortcut-tile';

import './index.scss';
import ShortcutService from './service';

const moduleName = 'ovhManagerHubShortcuts';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    shortcutTile,
  ])
  .component('ovhManagerHubShortcuts', component)
  .service('ShortcutService', ShortcutService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
