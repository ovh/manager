import angular from 'angular';

/*
 * uib-dropdown helper to center the viewport on the dropdown when opened
 */
export default function autoScrollOnToggleProvider() {
  this.$get = /* @ngInject */ ($timeout) => {
    return function autoScrollOnToggle(open) {
      if (open) {
        const dropdown = angular.element('.open > ul.dropdown-menu')[0];
        if (dropdown) {
          $timeout(
            () =>
              dropdown.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
              }),
            100,
          );
        }
      }
    };
  };
}
