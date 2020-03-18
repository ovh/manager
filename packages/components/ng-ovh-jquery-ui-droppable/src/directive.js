import angular from 'angular';
import $ from 'jquery';

export default /* @ngInject */ function () {
  return {
    restrict: 'A',
    scope: false,
    link(scope, el, attrs) {
      const obj = {
        droppableInfo: null,
        droppableId: null,
      };

      const opts = angular.isDefined(attrs.droppableOptions)
        ? scope.$eval(attrs.droppableOptions)
        : {};
      let evts = {};
      let options = null;

      function emitEvent(name, ui) {
        scope.$apply(() => {
          scope.$emit(name, {
            dragged: ui,
            draggedId: ui.draggable.context.attributes['data-draggable-id']
              ? ui.draggable.context.attributes['data-draggable-id'].value
              : null,
            droppable: obj,
          });
        });
      }

      attrs.$observe('droppableInfo', (droppableInfo) => {
        if (droppableInfo) {
          obj.droppableInfo = scope.$eval(attrs.droppableInfo);
        }
      });

      attrs.$observe('droppableId', (droppableId) => {
        obj.droppableId = droppableId;
      });

      attrs.$observe('droppableDisabled', (disabled) => {
        if ($(el).droppable) {
          $(el).droppable({
            disabled: disabled === 'true',
          });
        }
      });

      evts = {
        out(event, ui) {
          emitEvent('droppable.out', ui);
        },
        over(event, ui) {
          emitEvent('droppable.over', ui);
        },
        drop(event, ui) {
          emitEvent('droppable.drop', ui);
        },
      };

      options = $.extend({}, opts, evts);

      $(el).droppable(options);
    },
  };
}
