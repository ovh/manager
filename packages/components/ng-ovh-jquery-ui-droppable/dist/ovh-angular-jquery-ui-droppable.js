angular.module("ovh-angular-jquery-ui-droppable", []);

angular.module("ovh-angular-jquery-ui-droppable")
    .directive("droppable", function () {
        "use strict";

        return {
            restrict: "A",
            scope: false,
            link: function (scope, el, attrs) {

                var obj = {
                    droppableInfo: null,
                    droppableId: null
                };

                var opts = angular.isDefined(attrs.droppableOptions) ? scope.$eval(attrs.droppableOptions) : {};
                var evts = {};
                var options = null;

                function emitEvent (name, ui) {
                    scope.$apply(function () {
                        scope.$emit(name, {
                            dragged: ui,
                            draggedId: ui.draggable.context.attributes["data-draggable-id"] ? ui.draggable.context.attributes["data-draggable-id"].value : null,
                            droppable: obj
                        });
                    });
                }

                attrs.$observe("droppableInfo", function (droppableInfo) {
                    if (droppableInfo) {
                        obj.droppableInfo = scope.$eval(attrs.droppableInfo);
                    }
                });

                attrs.$observe("droppableId", function (droppableId) {
                    obj.droppableId = droppableId;
                });

                attrs.$observe("droppableDisabled", function (disabled) {
                    if ($(el).droppable) {
                        $(el).droppable({
                            disabled: disabled === "true"
                        });
                    }
                });

                evts = {
                    out: function (event, ui) {
                        emitEvent("droppable.out", ui);
                    },
                    over: function (event, ui) {
                        emitEvent("droppable.over", ui);
                    },
                    drop: function (event, ui) {
                        emitEvent("droppable.drop", ui);
                    }
                };

                options = $.extend({}, opts, evts);

                $(el).droppable(options);
            }
        };
    });
