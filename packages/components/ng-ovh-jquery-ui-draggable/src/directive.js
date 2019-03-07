import angular from 'angular';
import $ from 'jquery';

export default /* @ngInject */ function () {
  return {
    restrict: 'A',
    scope: false,
    link(scope, el, attrs) {
      const privateAttr = {
        draggableSrcClonedClass: null,
      };

      const obj = {
        draggableId: null,
        draggableInfo: null,
      };

      const opts = angular.isDefined(attrs.draggableOptions)
        ? scope.$eval(attrs.draggableOptions)
        : {};
      let evts = {};
      let options = null;

      function emitEvent(name, ui) {
        scope.$apply(() => {
          scope.$emit(name, {
            dragged: ui,
            draggable: obj,
          });
        });
      }

      if (angular.isDefined(attrs.draggableSrcClonedClass)) {
        privateAttr.draggableSrcClonedClass = attrs.draggableSrcClonedClass;
      }

      attrs.$observe('draggableInfo', (draggableInfo) => {
        if (draggableInfo) {
          obj.draggableInfo = scope.$eval(attrs.draggableInfo);
        }
      });

      attrs.$observe('draggableId', (draggableId) => {
        obj.draggableId = draggableId;
      });

      attrs.$observe('draggableDisabled', (disabled) => {
        if ($(el).draggable) {
          $(el).draggable({
            disabled: disabled === 'true',
          });
        }
      });

      evts = {
        drag(event, ui) {
          emitEvent('draggable.drag', ui);
        },
        start(event, ui) {
          if (privateAttr.draggableSrcClonedClass) {
            scope.$apply(() => {
              $(el).addClass(privateAttr.draggableSrcClonedClass);
            });
          }
          emitEvent('draggable.start', ui);
        },
        stop(event, ui) {
          if (privateAttr.draggableSrcClonedClass) {
            scope.$apply(() => {
              $(el).removeClass(privateAttr.draggableSrcClonedClass);
            });
          }
          emitEvent('draggable.stop', ui);
        },
      };

      options = $.extend({}, opts, evts);

      $(el).draggable(options);
    },
  };
}
