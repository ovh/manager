import gitRemovalComponent from './git-removal.component';
import gitRemovalRouting from './git-removal.routing';
import service from './git-removal.service';

const moduleName = 'ovhManagerHostingMultisiteGitRemoval';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingMultisiteGitRemovalComponent', gitRemovalComponent)
  .service('HostingMultisiteGitRemovalService', service)
  .config(gitRemovalRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
