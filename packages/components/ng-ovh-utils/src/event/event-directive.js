/**
 * @type directive
 * @name ovhDirectives:event
 * @description
 * event delegation by html attributes
 * # Usage
 * add attribute data-event-[eventName]="callback" into html element
 * @example
 * Html view :
 *<code:html>
 *  <div data-ng-controller="controller">
 *      <div data-event-click="callback" data-event-click-target="img">
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *          <img /><!-- target-->
 *      </div>
 *      <div data-event-dblclick="callback" data-event-dblclick-target="iframe.ici">
 *          <iframe></iframe>
 *          <iframe class="ici"></iframe><!-- target -->
 *      </div>
 *      <div data-event-mousedown="callbackWithData" data-event-mousedown-target="div > div" data-event-mousedown-data="'aaaaaa'">
 *          <div>
 *              <div></div> <!--target -->
 *          </div>
 *      </div>
 *      <div data-event-mouseup="callback"></div><!--target-->
 *      <!-- etc -->
 *  </div>
 *</code>
 * javascript:
 * <code:js>
 *  function controller () {
 *      $scope.callbackWithData = function (data, evt) {
 *          console.log(arguments);
 *      }
 *
 *      $scope.callback = function (evt) {
 *          console.log(arguments);
 *      }
 *
 *  }
 * </code>
 */
(function () {
    "use strict";
    var availableEvents = [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mouseover',
        'mouseout',
        'mousemove',
        'mouseenter',
        'mouseleave',
        'keydown',
        'keyup',
        'keypress',
        'blur'
    ];
    var eventsNumber = availableEvents.length;

    function createDirective (eventName) {

        var directiveName = $.camelCase('event-' + eventName);
        var name = eventName;
        var module = angular.module('ua.event');

        module.directive(directiveName, ['$parse', function ($parse) {
            return {
                restrict : 'A',
                link : function ($scope, $elm, $attr) {

                    var callback = $parse($attr[directiveName]),
                        target = $attr[directiveName + 'Target'],
                        data = $parse($attr[directiveName + 'Data']);

                    if (angular.isFunction(callback($scope))){
                        if (target) {
                            if (typeof data !== 'function') {
                                $($elm).delegate(target, name, data, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(data, evt);
                                    });
                                });
                            } else {
                                $($elm).delegate(target, name, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(evt);
                                    });
                                });
                            }
                        } else {
                            if (typeof data !== 'function') {
                                $elm.bind(name, data, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(data, evt);
                                    });
                                });
                            } else {
                                $elm.bind(name, function (evt) {
                                    $scope.$apply(function() {
                                        callback($scope)(evt);
                                    });
                                });
                            }
                        }
                    }
                }
            };
        }]);
    }

    for (eventsNumber;eventsNumber--;) {
        createDirective(availableEvents[eventsNumber]);
    }
})();
