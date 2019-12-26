// used to ensure that we can only edit a single project at a time
angular.module('managerApp').service(
  'DBaasTsSidebarEditMediator',
  /* @ngInject */ ($rootScope) => {
    let currentEditionScope = null;
    let watchScope = false; // true if we are already watching stateChanges

    return {
      startEdition(scope) {
        // one edition at a time, cancel previous edition if it exists
        if (currentEditionScope) {
          currentEditionScope.cancelEdition();
        }
        currentEditionScope = scope;
      },
      stopEdition() {
        if (currentEditionScope) {
          // hide the edit form
          currentEditionScope.resetTemplate();
        }
        currentEditionScope = null;
      },
      // when state of application changes, abort current edition
      watchForLeavingEdition() {
        const self = this;
        // only watch the rootScope once!
        if (!watchScope) {
          watchScope = true;
          $rootScope.$on('$stateChangeStart', () => {
            self.stopEdition();
          });
        }
      },
    };
  },
);
