import set from 'lodash/set';

angular.module('managerApp').directive('cuiCompareTo', () => ({
  restrict: 'A',
  require: 'ngModel',
  scope: {
    otherModelValue: '=cuiCompareTo',
  },
  link: (scope, element, attributes, ngModel) => {
    set(
      ngModel,
      '$validators.compareTo',
      (modelValue) => modelValue === scope.otherModelValue,
    );
    scope.$watch('otherModelValue', () => {
      ngModel.$validate();
    });
  },
}));
