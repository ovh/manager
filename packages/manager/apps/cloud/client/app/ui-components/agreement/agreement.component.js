(() => {
  angular.module('managerApp').component('cuiAgreements', {
    templateUrl: 'app/ui-components/agreement/agreement.component.html',
    bindings: {
      checkboxText: '@',
      contractListText: '@',
      agreements: '<',
      onCheck: '&',
    },
  });
})();
