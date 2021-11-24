export default /* @ngInject */ ($scope, $stateParams, $timeout, CdnDomain) => {
  $scope.loading = true;

  $scope.cacheRules = null;
  $scope.cacheRulesEntrySearchSelected = null;

  function reloadCacheRules() {
    $scope.loadCacheRules();
  }

  $scope.$watch(
    'cacheRulesEntrySearchSelected',
    (newValue) => {
      if ($scope.cacheRulesEntrySearchSelected !== null) {
        if ($scope.cacheRulesEntrySearchSelected === '') {
          reloadCacheRules();
        } else {
          $timeout(() => {
            if ($scope.cacheRulesEntrySearchSelected === newValue) {
              reloadCacheRules();
            }
          }, 500);
        }
      }
    },
    true,
  );

  $scope.loadCacheRules = function loadCacheRules(cacheRuleCount, offset) {
    $scope.searchLoading = true;
    CdnDomain.getCacheRules(
      $stateParams.productId,
      $stateParams.domain,
      cacheRuleCount,
      offset,
      $scope.cacheRulesEntrySearchSelected,
    ).then((cacheRules) => {
      $scope.cacheRules = cacheRules;
      $scope.loading = false;
      $scope.searchLoading = false;
    });
  };

  $scope.$on('cdn.domain.tabs.cacherule.refresh', () => {
    reloadCacheRules();
  });
};
