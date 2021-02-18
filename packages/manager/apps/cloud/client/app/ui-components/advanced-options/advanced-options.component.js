angular.module('managerApp').component('cuiAdvancedOptions', {
  transclude: true,
  template: `
            <div class="cui-advanced-options">
                <div class="cui-advanced-options__header">
                    <div class="cui-advanced-options__header-text">
                        <h5 class="oui-heading_6" data-ng-bind="$ctrl.title"></h5>
                        <div class="cui-advanced-options__text" data-ng-bind="$ctrl.text"></div>
                    </div>
                    <div class="cui-advanced-options__button"
                    data-ng-hide="$ctrl.expanded">
                        <button type="button"
                            class="cui-advanced-options__button oui-button oui-button_secondary"
                            data-ng-bind="$ctrl.buttonText"
                            data-ng-click="$ctrl.expanded = true"
                            aria-labelledby="{{$ctrl.title}}"></button>
                    </div>
                </div>
                <div class="cui-advanced-options__content"
                    data-ng-if="$ctrl.expanded"
                    data-ng-transclude></div>
            </div>`,
  bindings: {
    title: '<',
    text: '<',
    buttonText: '<',
    expanded: '<',
  },
});
