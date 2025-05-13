import template from './telephony-bulk-action.html';

export default {
  bindings: {
    serviceType: '@',
    billingAccount: '@',
    serviceName: '@',
    customClass: '@?',
    ngDisabled: '=?',
    bulkInfos: '<',
    getBulkParams: '&',
    onOpen: '&?',
    onSuccess: '&?',
    onError: '&?',
    filterServices: '&?',
    trackingPrefix: '@?',
  },
  template,
  controller: 'tucTelephonyBulkActionCtrl',
};
