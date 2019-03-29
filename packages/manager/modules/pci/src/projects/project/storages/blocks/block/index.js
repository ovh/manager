import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-ui-angular';
import 'ovh-api-services';

import blockAttach from './attach';
import blockDetach from './detach';
import blockDelete from './delete';
import blockEdit from './edit';

import routing from './block.routing';

const moduleName = 'ovhManagerPciStoragesBlocksBlock';

angular
  .module(moduleName, [
    blockAttach,
    blockDetach,
    blockDelete,
    blockEdit,
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
