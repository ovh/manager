import gitViewLastDeploymentComponent from './git-view-last-deployment.component';
import gitViewLastDeploymentRouting from './git-view-last-deployment.routing';
import service from './git-view-last-deployment.service';

const moduleName = 'ovhManagerHostingMultisiteGitViewLastDeployment';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(
    'hostingMultisiteGitViewLastDeploymentComponent',
    gitViewLastDeploymentComponent,
  )
  .service('HostingMultisiteGitViewLastDeploymentService', service)
  .config(gitViewLastDeploymentRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
