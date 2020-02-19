import component from './hosting-email-terminate.component';
import routing from './hosting-email-terminate.routes';

const moduleName = 'ovhManagerHostingEmailTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('hostingTerminateEmail', component)
  .config(routing);

export default moduleName;
