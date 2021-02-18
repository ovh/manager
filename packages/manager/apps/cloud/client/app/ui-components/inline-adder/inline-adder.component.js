angular.module('managerApp').directive(
  'ngTranscludeReplace',
  /* @ngInject */ ($log) => ({
    terminal: true,
    restrict: 'EA',
    link($scope, $element, $attr, ctrl, transclude) {
      if (!transclude) {
        $log.error(
          'orphan',
          'Illegal use of ngTranscludeReplace directive in the template! ' +
            'No parent directive that requires a transclusion found. ',
        );
        return;
      }
      transclude((clone) => {
        if (clone.length) {
          $element.replaceWith(clone);
        } else {
          $element.remove();
        }
      });
    },
  }),
);

angular
  .module('managerApp')
  .component('cuiInlineAdder', {
    template: `
            <div class="cui-inline-adder">
                <ng-transclude-replace></ng-transclude-replace>
            </div>
        `,
    controller: 'InlineAdderCtrl',
    controllerAs: '$ctrl',
    transclude: true,
    bindings: {
      onAdd: '&',
      onRemove: '&',
      uniqueProperty: '@',
    },
  })
  .directive('cuiInlineAdderGroup', () => ({
    replace: true,
    restrict: 'E',
    templateUrl: 'app/ui-components/inline-adder/inline-adder-group.html',
    controller: 'InlineAdderGroupCtrl',
    controllerAs: '$ctrl',
    transclude: true,
    require: {
      parent: '^cuiInlineAdder',
    },
    scope: true,
    bindToController: {
      item: '<',
      isNewItem: '<',
    },
  }))
  .directive('cuiInlineAdderItem', () => ({
    replace: true,
    restrict: 'E',
    template: `
            <div class="cui-inline-adder__group_item">
                <ng-transclude-replace></ng-transclude-replace>
            </div>
        `,
    transclude: true,
    require: {
      parent: '^cuiInlineAdderGroup',
    },
    scope: true,
  }));
