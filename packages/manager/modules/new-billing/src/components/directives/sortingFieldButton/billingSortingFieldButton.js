import controller from './billingSortingFieldButtonCtrl';

export default /* @ngInject */ function billingSortingFieldButtonDirective() {
  return {
    restrict: 'A',
    scope: {
      label: '@',
      associatedField: '@',
      activeField: '=',
      reverseOrder: '=',
      onChange: '=?',
    },
    bindToController: true,
    controllerAs: '$ctrl',
    controller,
    replace: false,
    template: `<button type="button"
                     class="btn btn-link"
                     data-ng-click="$ctrl.onClick()">
                <span data-ng-bind="$ctrl.label"></span>
                <i class="fa fa-chevron-down"
                   data-ng-if="$ctrl.isActive() && $ctrl.isAscending()"
                   aria-label="{{:: 'common_order_ascending' | translate }}"
                   aria-hidden="true">
                </i>
                <i class="fa fa-chevron-up"
                   data-ng-if="$ctrl.isActive() && $ctrl.isDescending()"
                   aria-label="{{:: 'common_order_descending' | translate }}"
                   aria-hidden="true">
                </i>
            </button>`,
  };
}
