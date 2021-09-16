import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './general-information.component';
import routing from './general-information.routing';

import notebooksConfigurationCommand from '../../components/configuration-command';
import addTag from './tags/add';
import deleteNotebook from './delete-notebook';

const moduleName = 'ovhManagerPciNotebookGeneralInformation';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    notebooksConfigurationCommand,
    addTag,
    deleteNotebook,
  ])
  .config(routing)
  .component('ovhManagerPciProjectNotebookGeneralInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
