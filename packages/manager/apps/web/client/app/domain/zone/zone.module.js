import routing from './zone.routing';

import activate from './activate/activate.module';

const moduleName = 'ovhManagerWebDomainZone';

angular.module(moduleName, [activate]).config(routing);

export default moduleName;
