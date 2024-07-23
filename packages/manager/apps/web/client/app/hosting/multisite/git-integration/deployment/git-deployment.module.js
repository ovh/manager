import gitDeploymentComponent from './git-deployment.component';
import gitDeploymentRouting from './git-deployment.routing';
import service from './git-deployment.service';

const moduleName = 'ovhManagerHostingMultisiteGitDeployment';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingMultisiteGitDeploymentComponent', gitDeploymentComponent)
  .service('HostingMultisiteGitDeploymentService', service)
  .config(gitDeploymentRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
