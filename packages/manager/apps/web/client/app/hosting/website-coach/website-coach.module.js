import component from './website-coach.component';
import routing from './website-coach.routing';

import './website-coach.less';

const moduleName = 'ovhManagerHostingWebsiteCoach';

angular
  .module(moduleName, [])
  .component('hostingWebsiteCoach', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
