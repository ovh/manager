import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './users-tokens.component';
import routing from './users-tokens.routing';

import createUser from './create-user';
import createToken from './create-token';
import deleteToken from './delete-token';

import aiPipeline from '../../components/ai-pipeline';

const moduleName = 'ovhManagerPciAiDashboardUsersTokens';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    createUser,
    createToken,
    deleteToken,
    aiPipeline,
  ])
  .config(routing)
  .component('pciProjectAiDashboardUsersTokens', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
