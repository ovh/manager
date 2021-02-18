/* eslint-disable */

import angular from 'angular';

import template from './template.html';

export default /* @ngInject */ function ($timeout) {
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
    if (!floor) {
      floor = 0;
    }

    if (!step) {
      step = 1 / Math.pow(10, precision);
    }

    const remainder = (value - floor) % step;
    const steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
    const decimals = Math.pow(10, precision);
    const roundedValue = steppedValue * decimals / decimals;
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
      markersCount: '@', // how many makers under the slider bar we want to display?
      markersLabelLow: '@', // label under the lower limit marker
      markersLabelHigh: '@', // label under the upper limit marker
    },
    template,
    compile(element, attributes) {
      const range = !attributes.ngModel && attributes.ngModelLow && attributes.ngModelHigh;
      const low = range ? 'ngModelLow' : 'ngModel';
      const high = 'ngModelHigh';
      const watchables = ['floor', 'ceiling', 'values', low, 'refreshTrigger'];
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
          let markers;
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
            for (_i = 0, _len = _ref.length; _i < _len; _i += 1) {
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
          markers = _ref[7];

          selection = angularize(bar.children()[0]);
          if (!range) {
            _ref1 = [maxPtr, highBub];
            for (_i = 0, _len = _ref1.length; _i < _len; _i += 1) {
              upper = _ref1[_i];
              upper.remove();
            }
            if (!attributes.highlight) {
              selection.remove();
            }
          }

          // Add marks under the slider
          if (attributes.markersCount) {
            let _n = parseInt(attributes.markersCount, 10) + 2; // we add the two markers for low and high values

            // Specify upper limit to 100 markers (more than enough ...)
            _n = Math.min(_n, 100);

            // we need at least one marker (minus the two low and high markers)
            if (_n > 2) {
              for (_i = 0; _i < _n; _i += 1) {
                angular.element('<div></div>').addClass('marker').css('left', `${100.0 * _i / (_n - 1)}%`).appendTo(markers);
              }

              // add some bottom space to display markers
              element.css('margin-bottom', `${parseInt(element.css('margin-bottom'), 10) + 10}px`);
            }
            if (attributes.markersLabelLow) {
              angular.element('<div></div>')
                .addClass('markerLabel')
                .css('left', '0%')
                .html(attributes.markersLabelLow)
                .appendTo(markers);
            }
            if (attributes.markersLabelHigh) {
              angular.element('<div></div>')
                .addClass('markerLabel')
                .css('left', '100%')
                .html(attributes.markersLabelHigh)
                .appendTo(markers);
            }

            // add some bottom spaces if there are marker labels to display
            if (attributes.markersLabelLow && attributes.markersLabelHigh) {
              element.css('margin-bottom', `${parseInt(element.css('margin-bottom'), 10) + 20}px`);
            }
          }

          scope.display = function () {
            const currentValue = scope.values && scope.values.length ? scope.values[scope.local.ngModelLow || scope.local.ngModel || 0] : scope.local.ngModelLow || scope.local.ngModel || 0;

            // var currentValue = scope.ngModel;//scope.values.length ? scope.values[scope.local.ngModelHigh] : scope.local.ngModelHigh;
            if (typeof attributes.displayCallback !== 'undefined') {
              return scope.displayCallback({ value: currentValue });
            }
            return currentValue;
          };

          if (attributes.disabled) {
            scope.$watch('disabled', (newVal) => {
              for (let i = 0; i < _ref.length; i += 1) {
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
            for (_j = 0, _len1 = watchables.length; _j < _len1; _j += 1) {
              value = watchables[_j];
              if (typeof value === 'number') {
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
            markers.css('margin-left', handleHalfWidth);

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
                default:

                                // Do nothing
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
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j += 1) {
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

          // When the slider is placed within an animated element that slowly comes into view,
          // the width of the container may vary within the first hundreds of milliseconds.
          // Therefore, we have to call updateDOM on an interval to make sure that the bar is
          // correctly stretched across the with of the container.
          let previousBarWidth;
          var intervalId = setInterval(() => {
            if (barWidth !== previousBarWidth) {
              updateDOM();
              previousBarWidth = barWidth;
            } else {
              clearInterval(intervalId);
            }
          }, 500);

          for (_j = 0, _len1 = watchables.length; _j < _len1; _j += 1) {
            w = watchables[_j];
            scope.$watch(w, refresher, true);
          }
          return window.addEventListener('resize', updateDOM);
        },
      };
    },
  };
}
/* eslint-enable */
