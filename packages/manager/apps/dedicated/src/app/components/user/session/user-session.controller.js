angular.module('App')
  .controller('SessionCtrl', class {
    constructor($scope, $document, $transitions, $translate) {
      _.set($document, 'title', $translate.instant('global_app_title'));
      // Scroll to anchor id
      $scope.scrollTo = (id) => {
        // Set focus to target
        if (_.isString(id)) {
          $document.find(`#${id}`)[0].focus();
        }
      };

      $transitions.onStart({},
        () => this.closeSidebar());
    }

    openSidebar() {
      this.sidebarIsOpen = true;
    }

    closeSidebar() {
      this.sidebarIsOpen = false;
    }
  });
