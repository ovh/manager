export default () => ({
  restrict: 'A',
  require: '?ngModel',
  link($scope, elem, attr, ngModel) {
    const tests = {};

    tests.oneLowercase = function oneLowercase(value) {
      return value.search(/[a-z]/g) !== -1;
    };

    tests.oneUppercase = function oneUppercase(value) {
      return value.search(/[A-Z]/g) !== -1;
    };

    tests.oneNumber = function oneNumber(value) {
      return value.search(/[0-9]/g) !== -1;
    };

    tests.minChars = function minChars(value) {
      return value.length >= 8;
    };

    $scope.$watch(
      () => ngModel.$modelValue,
      (value) => {
        let result;

        // eslint-disable-next-line no-restricted-syntax
        for (const test in tests) {
          // eslint-disable-next-line no-prototype-builtins
          if (tests.hasOwnProperty(test)) {
            result = false;
            if (value) {
              result = tests[test](value);
            }
            if (!result) {
              // eslint-disable-next-line no-param-reassign
              ngModel.$error[test] = true;
            } else {
              // eslint-disable-next-line no-param-reassign
              delete ngModel.$error[test];
            }
          }
        }
        /* eslint-enable */
        ngModel.$validate();
      },
    );
  },
});
