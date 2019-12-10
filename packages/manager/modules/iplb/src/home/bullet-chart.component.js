export default () => ({
  template: `
            <div class="oui-progress"
              data-ng-class="{
                'oui-progress_error': $ctrl.value >= 100,
                'oui-progress_warning': $ctrl.limit && $ctrl.value >= $ctrl.limit,
                'oui-progress_success': !$ctrl.label || !$ctrl.value || $ctrl.value < $ctrl.limit
              }">
              <div class="oui-progress__threshold"
                data-ng-if="$ctrl.limit"
                data-ng-style="{ left: $ctrl.getLimit() }"></div>
              <div class="oui-progress__bar oui-progress__bar_text-left"
                role="progressbar"
                aria-valuenow="{{$ctrl.getValue()}}"
                aria-valuemin="0"
                aria-valuemax="100"
                data-ng-style="{ width: $ctrl.getValue() }"
                data-ng-class="{
                  'oui-progress__bar_error': $ctrl.value >= 100,
                  'oui-progress__bar_warning': $ctrl.limit && $ctrl.value >= $ctrl.limit,
                  'oui-progress__bar_success': !$ctrl.label || !$ctrl.value || $ctrl.value < $ctrl.limit
                }">
                <span class="oui-progress__label"
                  data-ng-if="$ctrl.text"
                  data-ng-bind="$ctrl.text"></span>
              </div>
            </div>
            `,
  restrict: 'E',
  controller: class {
    getValue() {
      return `${this.value}%`;
    }

    getLimit() {
      return `${this.limit}%`;
    }
  },
  controllerAs: '$ctrl',
  scope: true,
  bindToController: {
    text: '<',
    value: '<',
    limit: '<',
  },
});
