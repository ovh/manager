import angular from 'angular';

import serviceExpirationLabelComponent from './service-expiration-label.component';
import serviceExpirationDateComponent from './service-expiration-date.component';

const moduleName = 'ovhManagerDedicatedHousingExpiration';

angular
  .module(moduleName, [])
  .component('serviceExpirationLabel', serviceExpirationLabelComponent)
  .component('serviceExpirationDate', serviceExpirationDateComponent);

export default moduleName;
