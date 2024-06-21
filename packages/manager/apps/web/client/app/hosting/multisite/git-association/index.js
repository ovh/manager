import hostingMultisiteGitAssociationComponent from './hosting-multisite-git-association.component';
import hostingMultisiteGitAssociationRouting from './hosting-multisite-git-association.routing';
import service from "./hosting-multisite-git-association.service";

const moduleName = 'ovhManagerHostingMultisiteGitAssociation';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingMultisiteGitAssociationComponent', hostingMultisiteGitAssociationComponent)
  .service('HostingMultisiteGitAssociationService', service)
  .config(hostingMultisiteGitAssociationRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
