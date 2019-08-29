export default () => ({
  restrict: 'A',
  require: '?ngModel',
  link($scope, elem, attr, ngModel) {
    const tests = {};

    tests.oneLowercase = function (value) {
      return value.search(/[a-z]/g) !== -1;
    };

    tests.oneUppercase = function (value) {
      return value.search(/[A-Z]/g) !== -1;
    };

    tests.oneNumber = function (value) {
      return value.search(/[0-9]/g) !== -1;
    };

    tests.minChars = function (value) {
      return value.length >= 8;
    };

    $scope.$watch(() => ngModel.$modelValue, (value) => {
      let result;

      /* eslint-disable */
      for (const test in tests) {
        if (tests.hasOwnProperty(test)) {
          result = false;
          if (value) {
            result = tests[test](value);
          }
          if (!result) {
            ngModel.$error[test] = true;
          } else {
            delete ngModel.$error[test];
          }
        }
      }
      /* eslint-enable */
      ngModel.$validate();
    });
  },
});
