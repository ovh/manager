angular.module("ovh-jquery-ui-draggable-ng", []);

angular.module("ovh-jquery-ui-draggable-ng").directive("draggable", function () {
    "use strict";

    return {
        restrict    : "A",
        scope : false,
        link : function (scope, el, attrs) {

            var privateAttr = {
                draggableSrcClonedClass : null
            };

            var obj = {
                draggableId   : null,
                draggableInfo : null
            };

            var opts = (angular.isDefined(attrs.draggableOptions)) ? scope.$eval(attrs.draggableOptions) : {},
                evts = {},
                options = null;


            function emitEvent (name, ui) {

                scope.$apply(function () {
                    scope.$emit(name, {
                        dragged : ui,
                        draggable : obj
                    });
                });
            }

            if (angular.isDefined(attrs.draggableSrcClonedClass)) {
                privateAttr.draggableSrcClonedClass = attrs.draggableSrcClonedClass;
            }

            attrs.$observe("draggableInfo", function (draggableInfo) {
                if (draggableInfo) {
                    obj.draggableInfo = scope.$eval(attrs.draggableInfo);
                }
            });

            attrs.$observe("draggableId", function (draggableId) {
                obj.draggableId = draggableId;
            });

            attrs.$observe("draggableDisabled", function (disabled) {
                if ($(el).draggable){
                    $(el).draggable({
                        disabled: disabled === "true"
                    });
                }
            });

            evts = {
                drag   : function (event, ui) {
                    emitEvent("draggable.drag", ui);
                },
                start  : function (event, ui) {
                    if (privateAttr.draggableSrcClonedClass) {
                        scope.$apply(function () {
                            $(el).addClass(privateAttr.draggableSrcClonedClass);
                        });
                    }
                    emitEvent("draggable.start", ui);
                },
                stop   : function (event, ui) {
                    if (privateAttr.draggableSrcClonedClass) {
                        scope.$apply(function () {
                            $(el).removeClass(privateAttr.draggableSrcClonedClass);
                        });
                    }
                    emitEvent("draggable.stop", ui);
                }
            };

            options = $.extend({}, opts, evts);

            $(el).draggable(options);
        }
    };
});

