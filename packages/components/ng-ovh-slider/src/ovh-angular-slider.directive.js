angular.module("ovh-angular-slider").directive("ovhSlider", function ($timeout) {
    "use strict";
    var angularize = function (element) {
        return angular.element(element);
    };

    var pixelize = function (position) {
        return "" + position + "px";
    };

    var offset = function (element, position) {
        return element.css({
            left: position
        });
    };

    var halfWidth = function (element) {
        return element[0].offsetWidth / 2;
    };

    var offsetLeft = function (element) {
        return element[0].offsetLeft;
    };

    var width = function (element) {
        return element[0].offsetWidth;
    };

    var contain = function (value) {
        if (isNaN(value)) {
            return value;
        }
        return Math.min(Math.max(0, value), 100);
    };

    var roundStep = function (value, precision, step, floor) {
        var decimals;
        var remainder;
        var roundedValue;
        var steppedValue;

        if (!floor) {
            floor = 0;
        }

        if (!step) {
            step = 1 / Math.pow(10, precision);
        }

        remainder = (value - floor) % step;
        steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
        decimals = Math.pow(10, precision);
        roundedValue = steppedValue * decimals / decimals;
        return parseFloat(roundedValue.toFixed(precision));
    };

    var events = {
        mouse: {
            start: "mousedown",
            move: "mousemove",
            end: "mouseup"
        },
        touch: {
            start: "touchstart",
            move: "touchmove",
            end: "touchend"
        }
    };

    return {
        restrict: "E",
        scope: {
            floor: "@",
            ceiling: "@",
            values: "=?",
            step: "@",
            highlight: "@",
            precision: "@",
            buffer: "@",
            dragstop: "@",
            ngModel: "=?",
            ngModelLow: "=?",
            ngModelHigh: "=?",
            refreshTrigger: "=?",
            displayCallback: "&",
            disabled: "=?",
            markersCount: "@", // how many makers under the slider bar we want to display?
            markersLabelLow: "@", // label under the lower limit marker
            markersLabelHigh: "@" // label under the upper limit marker
        },
        template: '<div class="bar"><div class="selection"></div></div>' +
        '<div class="handle low"></div><div class="handle high"></div>' +
        '<div class="bubble limit low">{{ values.length ? values[floor || 0] : floor }}</div>' +
        '<div class="bubble limit high">{{ values.length ? values[ceiling || values.length - 1] : ceiling }}</div>' +
        '<div class="bubble value low">{{ display() }}</div>' +
        '<div class="bubble value high">{{ values.length ? values[local.ngModelHigh] : local.ngModelHigh }}</div>' +
        '<div class="markers" ng-show="{{ markersCount > 0 }}"></div>',
        compile: function (element, attributes) {
            var high;
            var low;
            var range;
            var watchables;
            range = !attributes.ngModel && attributes.ngModelLow && attributes.ngModelHigh;
            low = range ? "ngModelLow" : "ngModel";
            high = "ngModelHigh";
            watchables = ["floor", "ceiling", "values", low, "refreshTrigger"];
            if (range) {
                watchables.push(high);
            }
            return {
                post: function (scope, element, attributes) {
                    var bar;
                    var barWidth;
                    var bound;
                    var ceilBub;
                    var dimensions;
                    var e;
                    var flrBub;
                    var handleHalfWidth;
                    var highBub;
                    var lowBub;
                    var markers;
                    var maxOffset;
                    var maxPtr;
                    var maxValue;
                    var minOffset;
                    var minPtr;
                    var minValue;
                    var ngDocument;
                    var offsetRange;
                    var selection;
                    var updateDOM;
                    var upper;
                    var valueRange;
                    var w;
                    var _i;
                    var _j;
                    var _len;
                    var _len1;
                    var _ref;
                    var _ref1;
                    _ref = (function () {
                        var _i;
                        var _len;
                        var _ref;
                        var _results;
                        _ref = element.children();
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            e = _ref[_i];
                            _results.push(angularize(e));
                        }
                        return _results;
                    })();
                    bar = _ref[0];
                    minPtr = _ref[1];
                    maxPtr = _ref[2];
                    flrBub = _ref[3];
                    ceilBub = _ref[4];
                    lowBub = _ref[5];
                    highBub = _ref[6];
                    markers = _ref[7];

                    selection = angularize(bar.children()[0]);
                    if (!range) {
                        _ref1 = [maxPtr, highBub];
                        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                            upper = _ref1[_i];
                            upper.remove();
                        }
                        if (!attributes.highlight) {
                            selection.remove();
                        }
                    }

                    // Add marks under the slider
                    if (attributes.markersCount) {
                        var _n = parseInt(attributes.markersCount, 10) + 2; // we add the two markers for low and high values

                        // Specify upper limit to 100 markers (more than enough ...)
                        _n = Math.min(_n, 100);

                        // we need at least one marker (minus the two low and high markers)
                        if (_n > 2) {
                            for (_i = 0; _i < _n; _i++) {
                                angular.element("<div></div>").addClass("marker").css("left", (100.0 * _i / (_n - 1)) + "%").appendTo(markers);
                            }

                            // add some bottom space to display markers
                            element.css("margin-bottom", (parseInt(element.css("margin-bottom"), 10) + 10) + "px");
                        }
                        if (attributes.markersLabelLow) {
                            angular.element("<div></div>")
                                .addClass("markerLabel")
                                .css("left", "0%")
                                .html(attributes.markersLabelLow)
                                .appendTo(markers);
                        }
                        if (attributes.markersLabelHigh) {
                            angular.element("<div></div>")
                                .addClass("markerLabel")
                                .css("left", "100%")
                                .html(attributes.markersLabelHigh)
                                .appendTo(markers);
                        }

                        // add some bottom spaces if there are marker labels to display
                        if (attributes.markersLabelLow && attributes.markersLabelHigh) {
                            element.css("margin-bottom", (parseInt(element.css("margin-bottom"), 10) + 20) + "px");
                        }
                    }

                    scope.display = function () {
                        var currentValue = scope.values && scope.values.length ? scope.values[scope.local.ngModelLow || scope.local.ngModel || 0] : scope.local.ngModelLow || scope.local.ngModel || 0;

                        // var currentValue = scope.ngModel;//scope.values.length ? scope.values[scope.local.ngModelHigh] : scope.local.ngModelHigh;
                        if (typeof attributes.displayCallback !== "undefined") {
                            return scope.displayCallback({ value: currentValue });
                        }
                        return currentValue;

                    };

                    if (attributes.disabled) {
                        scope.$watch("disabled", function (newVal) {
                            for (var i = 0; i < _ref.length; i++) {
                                if (newVal) {
                                    _ref[i].addClass("disabled");
                                } else {
                                    _ref[i].removeClass("disabled");
                                }
                            }
                        });
                    }

                    scope.local = {};
                    scope.local[low] = scope[low];
                    scope.local[high] = scope[high];
                    bound = false;
                    ngDocument = angularize(document);
                    handleHalfWidth = barWidth = minOffset = maxOffset = minValue = maxValue = valueRange = offsetRange = void 0;
                    dimensions = function () {
                        var value;
                        var _j;
                        var _len1;
                        var _ref2;
                        if (!scope.step) {
                            scope.step = 1;
                        }
                        if (!scope.floor) {
                            scope.floor = 0;
                        }
                        if (!scope.precision) {
                            scope.precision = 0;
                        }
                        if (!range) {
                            scope.ngModelLow = scope.ngModel;
                        }
                        _ref2 = scope.values;
                        if (_ref2 ? _ref2.length : void 0) {
                            if (!scope.ceiling) {
                                scope.ceiling = scope.values.length - 1;
                            }
                        }
                        scope.local[low] = scope[low];
                        scope.local[high] = scope[high];
                        for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
                            value = watchables[_j];
                            if (typeof value === "number") {
                                scope[value] = roundStep(parseFloat(scope[value]), parseInt(scope.precision, 10), parseFloat(scope.step), parseFloat(scope.floor));
                            }
                        }
                        handleHalfWidth = halfWidth(minPtr);
                        barWidth = width(bar);
                        minOffset = 0;
                        maxOffset = barWidth - width(minPtr);
                        minValue = parseFloat(scope.floor);
                        maxValue = parseFloat(scope.ceiling);
                        valueRange = maxValue - minValue;
                        offsetRange = maxOffset - minOffset;

                        // resize markers
                        markers.width(bar.width() - 2 * handleHalfWidth);
                        markers.css("margin-left", handleHalfWidth);

                        return offsetRange;
                    };
                    updateDOM = function () {
                        var bind;
                        var percentOffset;
                        var percentValue;
                        var pixelsToOffset;
                        var setBindings;
                        var setPointers;
                        dimensions();
                        percentOffset = function (offset) {
                            return contain(((offset - minOffset) / offsetRange) * 100);
                        };
                        percentValue = function (value) {
                            return contain(((value - minValue) / valueRange) * 100);
                        };
                        pixelsToOffset = function (percent) {
                            return pixelize(percent * offsetRange / 100);
                        };
                        setPointers = function () {
                            var newHighValue;
                            var newLowValue;
                            offset(ceilBub, pixelize(barWidth - width(ceilBub)));
                            newLowValue = percentValue(scope.local[low]);
                            offset(minPtr, pixelsToOffset(newLowValue));
                            offset(lowBub, pixelize(offsetLeft(minPtr) - halfWidth(lowBub) + handleHalfWidth));
                            offset(selection, pixelize(offsetLeft(minPtr) + handleHalfWidth));
                            switch (true) {
                            case range:
                                newHighValue = percentValue(scope.local[high]);
                                offset(maxPtr, pixelsToOffset(newHighValue));
                                offset(highBub, pixelize(offsetLeft(maxPtr) - halfWidth(highBub) + handleHalfWidth));
                                return selection.css({
                                    width: pixelsToOffset(newHighValue - newLowValue)
                                });
                            case attributes.highlight === "right":
                                return selection.css({
                                    width: pixelsToOffset(110 - newLowValue)
                                });
                            case attributes.highlight === "left":
                                selection.css({
                                    width: pixelsToOffset(newLowValue)
                                });
                                return offset(selection, 0);
                            default:

                                // Do nothing
                            }
                        };
                        bind = function (handle, bubble, ref, events) {
                            var currentRef;
                            var onEnd;
                            var onMove;
                            var onStart;
                            currentRef = ref;
                            onEnd = function () {
                                bubble.removeClass("active");
                                handle.removeClass("active");
                                ngDocument.unbind(events.move);
                                ngDocument.unbind(events.end);
                                if (scope.dragstop) {
                                    scope[high] = scope.local[high];
                                    scope[low] = scope.local[low];
                                }
                                currentRef = ref;
                                return scope.$apply();
                            };
                            onMove = function (event) {
                                if (scope.disabled) {
                                    return;
                                }
                                var eventX;
                                var newOffset;
                                var newPercent;
                                var newValue;
                                var _ref2;
                                var _ref3;
                                var _ref4;
                                var _ref5;
                                eventX = event.clientX || ((_ref2 = event.touches) ? (_ref3 = _ref2[0]) ? _ref3.clientX : void 0 : void 0) || ((_ref4 = event.originalEvent) ? (_ref5 = _ref4.changedTouches) ? _ref5[0].clientX : void 0 : void 0) || 0;
                                newOffset = eventX - element[0].getBoundingClientRect().left - handleHalfWidth;
                                newOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);
                                newPercent = percentOffset(newOffset);
                                newValue = minValue + (valueRange * newPercent / 100.0);
                                if (range) {
                                    switch (currentRef) {
                                    case low:
                                        if (newValue > scope.local[high]) {
                                            currentRef = high;
                                            minPtr.removeClass("active");
                                            lowBub.removeClass("active");
                                            maxPtr.addClass("active");
                                            highBub.addClass("active");
                                            setPointers();
                                        } else if (scope.buffer > 0) {
                                            newValue = Math.min(newValue, scope.local[high] - scope.buffer);
                                        }
                                        break;
                                    case high:
                                        if (newValue < scope.local[low]) {
                                            currentRef = low;
                                            maxPtr.removeClass("active");
                                            highBub.removeClass("active");
                                            minPtr.addClass("active");
                                            lowBub.addClass("active");
                                            setPointers();
                                        } else if (scope.buffer > 0) {
                                            newValue = Math.max(newValue, parseInt(scope.local[low], 10) + parseInt(scope.buffer, 10));
                                        }
                                        break;
                                    default:

                                        // Do nothing
                                    }
                                }
                                newValue = roundStep(newValue, parseInt(scope.precision, 10), parseFloat(scope.step), parseFloat(scope.floor));
                                scope.local[currentRef] = newValue;
                                if (!scope.dragstop) {
                                    scope[currentRef] = newValue;
                                }
                                setPointers();
                                return scope.$apply();
                            };
                            onStart = function (event) {
                                dimensions();
                                bubble.addClass("active");
                                handle.addClass("active");
                                setPointers();
                                event.stopPropagation();
                                event.preventDefault();
                                ngDocument.bind(events.move, onMove);
                                return ngDocument.bind(events.end, onEnd);
                            };
                            return handle.bind(events.start, onStart);
                        };
                        setBindings = function () {
                            var method;
                            var _j;
                            var _len1;
                            var _ref2;
                            _ref2 = ["touch", "mouse"];
                            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                                method = _ref2[_j];
                                bind(minPtr, lowBub, low, events[method]);
                                bind(maxPtr, highBub, high, events[method]);
                            }
                            bound = true;
                            return true;
                        };
                        if (!bound) {
                            setBindings();
                        }
                        return setPointers();
                    };
                    var refresher = function () {
                        $timeout(updateDOM);
                    };

                    // When the slider is placed within an animated element that slowly comes into view,
                    // the width of the container may vary within the first hundreds of milliseconds.
                    // Therefore, we have to call updateDOM on an interval to make sure that the bar is
                    // correctly stretched across the with of the container.
                    var previousBarWidth;
                    var intervalId = setInterval(function () {
                        if (barWidth !== previousBarWidth) {
                            updateDOM();
                            previousBarWidth = barWidth;
                        } else {
                            clearInterval(intervalId);
                        }
                    }, 500);

                    for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
                        w = watchables[_j];
                        scope.$watch(w, refresher, true);
                    }
                    return window.addEventListener("resize", updateDOM);
                }
            };
        }
    };
});
