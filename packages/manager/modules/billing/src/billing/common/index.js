import billingRenewHelper from './renew-helper.service';
import billingUserService from './User';
import billingMessageParserService from './messageParser';
import billingAuthService from './Auth';
import billingdateRangeSelectionService from './dateRangeSelection';

const moduleName = 'ovhManagerBillingCommonCode';

angular
  .module(moduleName, [])
  .service('billingRenewHelper', billingRenewHelper)
  .service('BillingUser', billingUserService)
  .service('BillingmessageParser', billingMessageParserService)
  .service('BillingAuth', billingAuthService)
  .service('BillingdateRangeSelection', billingdateRangeSelectionService);

export default moduleName;
