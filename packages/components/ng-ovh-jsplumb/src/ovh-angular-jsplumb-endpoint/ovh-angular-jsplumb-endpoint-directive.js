/**
 * @ngdoc directive
 * @name ovh-angular-jsplumb.directive:jsplumbEndpoint
 * @scope
 * @restrict A
 * @param  {String} id                          Identifier of the endpoint
 * @param  {Array@} jsplumbEndpointConnectionIds Identifiers to link to
 * @param {Object} jsplumbEndpointSourceOptions Options of the endpoint as source
 * @param {Object} jsplumbEndpointTargetOptions Options of the endpoint as target
 * @description
 *
 * Create a graph endpoint
 *
 * Example
 *
 * <pre>
 *     // script.js
 *     angular.module("myApp", ["ovh-angular-jsplumb"]);
 *     angular.module("myApp").controller("foo", function() {
 *          var self = this;
 *
 *          this.instanceOptions = {
 *               PaintStyle : {
 *                   lineWidth : 2,
 *                   strokeStyle : "#354291"
 *               },
 *               HoverPaintStyle : {
 *                   lineWidth : 4,
 *                   strokeStyle : "#354291"
 *               },
 *               MaxConnections : -1
 *          };
 *
 *          this.anchors = {
 *               bottom : {
 *                  source : {
 *                      anchor : [0.5, 0.5, 0, 1],
 *                      connector: connector
 *                  },
 *                  target : {
 *                      anchor : [0.5, 0.5, 0, 1],
 *                      connector: connector
 *                  }
 *              },
 *              top : {
 *                  source : {
 *                      anchor : [0.5, 0.5, 0, -1],
 *                      connector: connector
 *                  },
 *                  target : {
 *                      anchor : [0.5, 0.5, 0, -1],
 *                      connector: connector
 *                  }
 *              }
 *          };
 *
 *          $scope.$on("jsplumb.instance.created", function (evt, instance) {
 *              self.jsPlumb = instance;
 *              instance.Defaults.Container=$("body");
 *          });
 *
 *         function init() {
 *            self.jsplumbReady = false;
 *            jsPlumbService.jsplumbInit().finally(function () {
 *                self.jsplumbReady = true;
 *            });
 *
 *         }
 *
 *         init();
 *     });
 * </pre>
 *
 * <pre>
 *     <div data-ng-if="Foo.jsplumbReady" data-jsplumb-instance="Foo.instanceOptions">
 *         <div id="one"
 *               data-jsplumb-endpoint-source-options="Foo.endpointOptions.top.source"
                 data-jsplumb-endpoint-target-options="Foo.endpointOptions.bottom.target"
                 data-jsplumb-endpoint-connection-ids="[]">hello world</div>

 *         <div id="two"
 *               data-jsplumb-endpoint-source-options="Foo.endpointOptions.top.source"
 *               data-jsplumb-endpoint-target-options="Foo.endpointOptions.bottom.target"
 *               data-jsplumb-endpoint-connection-ids="['one']">hello world</div>
 *     </div>
 * </pre>
 *
 *
 */
angular.module("ovh-angular-jsplumb").directive("jsplumbEndpoint", function ($rootScope, $parse) {

    "use strict";

    return {
        restrict: "A",
        require: "^jsplumbInstance",
        scope: true,
        compile: function () {
            return {
                post: function ($scope, $element, attr, instanceCtrl) {

                    $scope.attr = attr;

                    $scope.$applyAsync(function () {
                        var jsplumbInstance = instanceCtrl.getInstance();
                        var endpointSourceOptions = $parse(attr.jsplumbEndpointSourceOptions)($scope);
                        var endpointTargetOptions = $parse(attr.jsplumbEndpointTargetOptions)($scope);

                        $scope.connectionIds = $parse(attr.jsplumbEndpointConnectionIds)($scope) || [];

                        // add class to element
                        $element.addClass("_jsPlumb_ng_endpoint");

                        // create endpoint source
                        if (endpointSourceOptions) {
                            jsplumbInstance.makeSource($element, endpointSourceOptions);
                        }

                        // create endpoint target
                        if (endpointTargetOptions) {
                            jsplumbInstance.makeTarget($element, endpointTargetOptions);
                        }

                        $scope.$watch("attr.jsplumbEndpointConnectionIds", function (nIds, oIds) {
                            var newIds = $parse(nIds)() || [];
                            var oldIds = $parse(oIds)() || [];

                            var deletedIds = _.difference(oldIds, newIds) || [];

                            if (newIds && newIds.length) {
                                instanceCtrl.connectEndpointsMultiple($element.attr("id"), newIds);
                            }

                            if (deletedIds && deletedIds.length) {
                                instanceCtrl.disconnectEndpointsMultiple($element.attr("id"), deletedIds);
                            }
                        });

                        $scope.$watch("attr.jsplumbEndpointEnabled", function (nVal, oVal) {
                            var newVal = $parse(nVal)();
                            var oldVal = $parse(oVal)();

                            if (newVal === undefined && oldVal === undefined) {
                                return;
                            }

                            jsplumbInstance.setSourceEnabled($element, newVal);
                            jsplumbInstance.setTargetEnabled($element, newVal);

                        });

                        $scope.$watch("attr.id", function (newId, oldId) {
                            $rootScope.$broadcast("jsplumb.endpoint.idChanged", newId, oldId);
                        });

                        $rootScope.$broadcast("jsplumb.endpoint.created", $element.attr("id"), $scope.connectionIds, jsplumbInstance);

                        $scope.$on("$destroy", function () {
                            jsplumbInstance.removeAllEndpoints($element);
                            jsplumbInstance.remove($element);
                            jsplumbInstance.repaintEverything();
                        });
                    });

                }
            };
        }
    };

});
