/**
 * <form name="myForm">
 *   <input
 *     name="myInput"
 *     data-forbid
 *     data-forbid-others="[ 'some', 'other', 'values' ]"
 *   />
 *   <div ng-messages="myForm.myInput.$error"
 *     <p data-ng-message="forbid">Please choose another value</p>
 *     <p data-ng-message="forbidOthers">"some", "other", "values" are forbidden</p>
 *   </div>
 * </form>
 */
export default () => ({
  restrict: 'A',
  require: 'ngModel',
  scope: {
    forbidOthers: '<?',
  },
  link: (scope, element, attributes, ngModelController) => {
    const unwatch = scope.$watch(
      () => ngModelController.$modelValue,
      ($modelValue) => {
        const { forbidOthers } = scope;

        Object.assign(ngModelController.$validators, {
          forbid: (value) => (value ? value !== $modelValue : true),
          forbidOthers: (value) =>
            forbidOthers && value ? !forbidOthers.includes(value) : true,
        });

        ngModelController.$validate();
        unwatch();
      },
    );
  },
});
