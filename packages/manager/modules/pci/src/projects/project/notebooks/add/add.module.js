import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

import notebooksConfigurationCommand from '../components/configuration-command';
import notebookConfiguration from './components/notebook-configuration';
import notebookEditorsList from './components/notebook-editors-list';
import notebookFrameworksList from './components/notebook-frameworks-list';
import notebookPrivacySettings from './components/notebook-privacy-settings';
import notebookResources from './components/notebook-resources';
import notebookAttach from './components/notebook-attach';
import notebookReview from './components/notebook-review';

const moduleName = 'ovhManagerPciNotebooksAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    notebooksConfigurationCommand,
    notebookConfiguration,
    notebookEditorsList,
    notebookFrameworksList,
    notebookPrivacySettings,
    notebookResources,
    notebookAttach,
    notebookReview,
  ])
  .config(routing)
  .component('pciProjectNotebooksAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
