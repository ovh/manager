import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';

import extraPricingDetailComponent from './extra-pricing-detail.component';

const moduleName = 'ovhManagerProductOffersPricingExtra';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(
    'ovhManagerProductOffersExtraPricingDetail',
    extraPricingDetailComponent,
  );

export default moduleName;
