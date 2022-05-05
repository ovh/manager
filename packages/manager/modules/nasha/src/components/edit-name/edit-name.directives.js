export const mismatchDirective = () => ({
  restrict: 'A',
  require: 'ngModel',
  scope: {
    mismatch: '@',
  },
  link: (scope, element, attributes, ngModelController) => {
    const initialValue = scope.mismatch;
    Object.assign(ngModelController.$validators, {
      mismatch: (value) => value !== initialValue,
    });
  },
});

export default {
  mismatchDirective,
};
