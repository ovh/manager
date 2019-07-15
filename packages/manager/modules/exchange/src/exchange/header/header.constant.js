const AUTORENEW_URL = {
  EU: 'https://www.ovh.com/manager/dedicated/#/billing/autoRenew?searchText=',
  CA: 'https://ca.ovh.com/manager/#/billing/autoRenew?searchText=',
};

angular.module('Module.exchange')
  .constant('AUTORENEW_URL', AUTORENEW_URL);
