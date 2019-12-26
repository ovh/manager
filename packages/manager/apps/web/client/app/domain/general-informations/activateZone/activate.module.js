import routing from './activate.routing';

import zoneActivation from '../../zone/activate/activate.module';

const moduleName = 'ovhManagerWebDomainInformationZoneActivate';

angular.module(moduleName, [zoneActivation]).config(routing);

export default moduleName;
