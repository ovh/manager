angular
  .module('managerApp')
  .run(($q, $rootScope, $transitions, $translate, SessionService) => {
    $transitions.onSuccess(
      {},
      () => {
        $q.all({
          user: SessionService.getUser(),
          translate: $translate.refresh(),
        }).then(() => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.managerPreloadHide += ' manager-preload-hide';
        });
      },
      {
        priority: -1, // Last to load so we hide as much as possible
      },
    );
  });
