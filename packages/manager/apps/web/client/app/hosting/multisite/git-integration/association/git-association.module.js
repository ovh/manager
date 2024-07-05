import gitAssociationComponent from './git-association.component';
import gitAssociationRouting from './git-association.routing';
import service from './git-association.service';

const moduleName = 'ovhManagerHostingMultisiteGitAssociation';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingMultisiteGitAssociationComponent', gitAssociationComponent)
  .service('HostingMultisiteGitAssociationService', service)
  .config(gitAssociationRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
