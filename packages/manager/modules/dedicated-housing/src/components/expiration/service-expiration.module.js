import angular from 'angular';

import serviceExpirationLabelComponent from './service-expiration-label.component';
import serviceExpirationDateComponent from './service-expiration-date.component';

const moduleName = 'ovhManagerDedicatedHousingExpiration';

angular
  .module(moduleName, [])
  .component(
    'dedicatedHousingServiceExpirationLabel',
    serviceExpirationLabelComponent,
  )
  .component(
    'dedicatedHousingServiceExpirationDate',
    serviceExpirationDateComponent,
  );

export default moduleName;
