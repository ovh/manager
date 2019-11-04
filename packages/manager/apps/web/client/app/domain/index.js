import generalInformationsState from './general-informations/domain-general-informations.state';
import webhosting from './webhosting';

import routing from './domain.routing';

const moduleName = 'ovhManagerWebDomainModule';

angular
  .module(moduleName, [
    webhosting,
  ])
  .config(routing)
  .config(generalInformationsState);

export default moduleName;
