import routing from './activate.routing';

import zoneActivate from '../../zone/activate/activate.module';

const moduleName = 'ovhManagerWebDomainInformationZoneActivate';

angular.module(moduleName, [zoneActivate]).config(routing);

export default moduleName;
