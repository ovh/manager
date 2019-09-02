import angular from 'angular';

export default /* @ngInject */ ($timeout) => {
  const angularize = function (element) {
    return angular.element(element);
  };

  const pixelize = function (position) {
    return `${position}px`;
  };

  const offset = function (element, position) {
    return element.css({
      left: position,
    });
  };

  const halfWidth = function (element) {
    return element[0].offsetWidth / 2;
  };

  const offsetLeft = function (element) {
    return element[0].offsetLeft;
  };

  const width = function (element) {
    return element[0].offsetWidth;
  };

  const contain = function (value) {
    if (isNaN(value)) {
      return value;
    }
    return Math.min(Math.max(0, value), 100);
  };

  const roundStep = function (value, precision, step, floor) {
    let decimals;
    let remainder;
    let roundedValue;
    let steppedValue;
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

  const events = {
    mouse: {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
    },
    touch: {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
    },
  };

  return {
    restrict: 'E',
    scope: {
      floor: '@',
      ceiling: '@',
      values: '=?',
      step: '@',
      highlight: '@',
      precision: '@',
      buffer: '@',
      dragstop: '@',
      ngModel: '=?',
      ngModelLow: '=?',
      ngModelHigh: '=?',
      refreshTrigger: '=?',
      displayCallback: '&',
      disabled: '=?',
    },
    template: '<div class="bar"><div class="selection"></div></div>' +
        '<div class="handle low"></div><div class="handle high"></div>' +
        '<div class="bubble limit low">{{ values.length ? values[floor || 0] : floor }}</div>' +
        '<div class="bubble limit high">{{ values.length ? values[ceiling || values.length - 1] : ceiling }}</div>' +
        '<div class="bubble value low">{{ display() }}</div>' +
        '<div class="bubble value high">{{ values.length ? values[local.ngModelHigh] : local.ngModelHigh }}</div>',
    compile(element, attributes) {
      let high;
      let low;
      let range;
      let watchables;

      range = !attributes.ngModel && attributes.ngModelLow && attributes.ngModelHigh;
      low = range ? 'ngModelLow' : 'ngModel';
      high = 'ngModelHigh';
      watchables = ['floor', 'ceiling', 'values', low, 'refreshTrigger'];
      if (range) {
        watchables.push(high);
      }
      return {
        post(scope, element, attributes) {
          let bar;
          let barWidth;
          let bound;
          let ceilBub;
          let dimensions;
          let e;
          let flrBub;
          let handleHalfWidth;
          let highBub;
          let lowBub;
          let maxOffset;
          let maxPtr;
          let maxValue;
          let minOffset;
          let minPtr;
          let minValue;
          let ngDocument;
          let offsetRange;
          let selection;
          let updateDOM;
          let upper;
          let valueRange;
          let w;
          let _i;
          let _j;
          let _len;
          let _len1;
          let _ref;
          let _ref1;
          _ref = (function () {
            let _i;
            let _len;
            let _ref;
            let _results;

            _ref = element.children();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              e = _ref[_i];
              _results.push(angularize(e));
            }
            return _results;
          }());
          bar = _ref[0];
          minPtr = _ref[1];
          maxPtr = _ref[2];
          flrBub = _ref[3];
          ceilBub = _ref[4];
          lowBub = _ref[5];
          highBub = _ref[6];
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

          scope.display = function () {
            const currentValue = scope.values && scope.values.length ? scope.values[scope.local.ngModelLow || scope.local.ngModel || 0] : scope.local.ngModelLow || scope.local.ngModel || 0;
            if (typeof attributes.displayCallback !== 'undefined') {
              return scope.displayCallback({ value: currentValue });
            }
            return currentValue;
          };

          if (attributes.disabled) {
            scope.$watch('disabled', (newVal) => {
              for (let i = 0; i < _ref.length; i++) {
                if (newVal) {
                  _ref[i].addClass('disabled');
                } else {
                  _ref[i].removeClass('disabled');
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
            let value;
            let _j;
            let _len1;
            let _ref2;
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
              if (typeof value === 'number') {
                scope[value] = roundStep(parseFloat(scope[value]), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
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
            return offsetRange;
          };
          updateDOM = function () {
            let bind;
            let percentOffset;
            let percentValue;
            let pixelsToOffset;
            let setBindings;
            let setPointers;
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
              let newHighValue;
              let newLowValue;
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
                    width: pixelsToOffset(newHighValue - newLowValue),
                  });
                case attributes.highlight === 'right':
                  return selection.css({
                    width: pixelsToOffset(110 - newLowValue),
                  });
                case attributes.highlight === 'left':
                  selection.css({
                    width: pixelsToOffset(newLowValue),
                  });
                  return offset(selection, 0);
              }
            };
            bind = function (handle, bubble, ref, events) {
              let currentRef;
              let onEnd;
              let onMove;
              let onStart;
              currentRef = ref;
              onEnd = function () {
                bubble.removeClass('active');
                handle.removeClass('active');
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

                let eventX;
                let newOffset;
                let newPercent;
                let newValue;
                let _ref2;
                let _ref3;
                let _ref4;
                let _ref5;

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
                        minPtr.removeClass('active');
                        lowBub.removeClass('active');
                        maxPtr.addClass('active');
                        highBub.addClass('active');
                        setPointers();
                      } else if (scope.buffer > 0) {
                        newValue = Math.min(newValue, scope.local[high] - scope.buffer);
                      }
                      break;
                    case high:
                      if (newValue < scope.local[low]) {
                        currentRef = low;
                        maxPtr.removeClass('active');
                        highBub.removeClass('active');
                        minPtr.addClass('active');
                        lowBub.addClass('active');
                        setPointers();
                      } else if (scope.buffer > 0) {
                        newValue = Math.max(newValue, parseInt(scope.local[low]) + parseInt(scope.buffer));
                      }
                  }
                }
                newValue = roundStep(newValue, parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
                scope.local[currentRef] = newValue;
                if (!scope.dragstop) {
                  scope[currentRef] = newValue;
                }
                setPointers();
                return scope.$apply();
              };
              onStart = function (event) {
                dimensions();
                bubble.addClass('active');
                handle.addClass('active');
                setPointers();
                event.stopPropagation();
                event.preventDefault();
                ngDocument.bind(events.move, onMove);
                return ngDocument.bind(events.end, onEnd);
              };
              return handle.bind(events.start, onStart);
            };
            setBindings = function () {
              let method;
              let _j;
              let _len1;
              let _ref2;

              _ref2 = ['touch', 'mouse'];
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
          const refresher = function () {
            $timeout(updateDOM);
          };
          $timeout(updateDOM);
          for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
            w = watchables[_j];
            scope.$watch(w, refresher, true);
          }
          return window.addEventListener('resize', updateDOM);
        },
      };
    },
  };
}
