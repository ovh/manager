import billingDateRangeDirective from './directives/dateRange/billingDateRange.directive';
import billingSortingFieldButton from './directives/sortingFieldButton/billingSortingFieldButton';
import billingApiSchema from './api/api-schema';
import billingApi from './api/api';
import billingRenewDate from './renewDate/billing-renew-date.component';
import billingRenewLabel from './renewLabel/billing-renew-label.component';
import renewFrequenceFilter from './filters/renewFrequence';

const moduleName = 'ovhManagerBillingComponents';

angular
  .module(moduleName, [])
  .directive('billingDateRange', billingDateRangeDirective)
  .directive('billingSortingFieldButton', billingSortingFieldButton)
  .service('BillingApiSchema', billingApiSchema)
  .service('BillingApi', billingApi)
  .filter('renewFrequence', renewFrequenceFilter)
  .component('billingRenewDate', billingRenewDate)
  .component('billingRenewLabel', billingRenewLabel);

export default moduleName;
