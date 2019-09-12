import isString from 'lodash/isString';
import set from 'lodash/set';

angular.module('App')
  .controller('SessionCtrl', class {
    constructor($scope, $document, $transitions, $translate) {
      set($document, 'title', $translate.instant('global_app_title'));
      // Scroll to anchor id
      $scope.scrollTo = (id) => {
        // Set focus to target
        if (isString(id)) {
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
