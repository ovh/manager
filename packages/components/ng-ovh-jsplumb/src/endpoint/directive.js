/**
 * @ngdoc directive
 * @name ngOvhJsplumb.directive:jsplumbEndpoint
 * @scope
 * @restrict A
 * @param  {String} id                          Identifier of the endpoint
 * @param  {Array@} jsplumbEndpointConnectionIds Identifiers to link to
 * @param {Object} jsplumbEndpointSourceOptions Options of the endpoint as source
 * @param {Object} jsplumbEndpointTargetOptions Options of the endpoint as target
 * @description
 * <p>Create a graph endpoint</p>
 * @example
 <example module="myApp">
    <file name="script.js">
        angular.module('myApp', [])
        angular.module("myApp").controller("foo", function() {
            var self = this;

            this.instanceOptions = {
                    PaintStyle : {
                        lineWidth : 2,
                        strokeStyle : "#354291"
                    },
                    HoverPaintStyle : {
                        lineWidth : 4,
                        strokeStyle : "#354291"
                    },
                    MaxConnections : -1
            };

            this.anchors = {
                    bottom : {
                    source : {
                        anchor : [0.5, 0.5, 0, 1],
                        connector: connector
                    },
                    target : {
                        anchor : [0.5, 0.5, 0, 1],
                        connector: connector
                    }
                },
                top : {
                    source : {
                        anchor : [0.5, 0.5, 0, -1],
                        connector: connector
                    },
                    target : {
                        anchor : [0.5, 0.5, 0, -1],
                        connector: connector
                    }
                }
            };

            $scope.$on("jsplumb.instance.created", function (evt, instance) {
                self.jsPlumb = instance;
                instance.Defaults.Container=$("body");
            });

            function init() {
                self.jsplumbReady = false;
                jsPlumbService.jsplumbInit().finally(function () {
                    self.jsplumbReady = true;
                });

            }

            init();
        });
    </file>
    <file name="index.html">
        <div data-ng-if="Foo.jsplumbReady" data-jsplumb-instance="Foo.instanceOptions">
            <div id="one"
                    data-jsplumb-endpoint-source-options="Foo.endpointOptions.top.source"
                    data-jsplumb-endpoint-target-options="Foo.endpointOptions.bottom.target"
                    data-jsplumb-endpoint-connection-ids="[]">hello world</div>

            <div id="two"
                    data-jsplumb-endpoint-source-options="Foo.endpointOptions.top.source"
                    data-jsplumb-endpoint-target-options="Foo.endpointOptions.bottom.target"
                    data-jsplumb-endpoint-connection-ids="['one']">hello world</div>
        </div>
    </file>
 </example>
 */
import difference from 'lodash/difference';

export default /* @ngInject */ function($rootScope, $parse) {
  return {
    restrict: 'A',
    require: '^jsplumbInstance',
    scope: true,
    compile() {
      return {
        post($scope, $element, attr, instanceCtrl) {
          $scope.attr = attr;

          $scope.$applyAsync(() => {
            const jsplumbInstance = instanceCtrl.getInstance();
            const endpointSourceOptions = $parse(
              attr.jsplumbEndpointSourceOptions,
            )($scope);
            const endpointTargetOptions = $parse(
              attr.jsplumbEndpointTargetOptions,
            )($scope);

            $scope.connectionIds =
              $parse(attr.jsplumbEndpointConnectionIds)($scope) || [];

            // add class to element
            $element.addClass('_jsPlumb_ng_endpoint');

            // create endpoint source
            if (endpointSourceOptions) {
              jsplumbInstance.makeSource($element, endpointSourceOptions);
            }

            // create endpoint target
            if (endpointTargetOptions) {
              jsplumbInstance.makeTarget($element, endpointTargetOptions);
            }

            $scope.$watch('attr.jsplumbEndpointConnectionIds', (nIds, oIds) => {
              const newIds = $parse(nIds)() || [];
              const oldIds = $parse(oIds)() || [];

              const deletedIds = difference(oldIds, newIds) || [];

              if (newIds && newIds.length) {
                instanceCtrl.connectEndpointsMultiple(
                  $element.attr('id'),
                  newIds,
                );
              }

              if (deletedIds && deletedIds.length) {
                instanceCtrl.disconnectEndpointsMultiple(
                  $element.attr('id'),
                  deletedIds,
                );
              }
            });

            $scope.$watch('attr.jsplumbEndpointEnabled', (nVal, oVal) => {
              const newVal = $parse(nVal)();
              const oldVal = $parse(oVal)();

              if (newVal === undefined && oldVal === undefined) {
                return;
              }

              jsplumbInstance.setSourceEnabled($element, newVal);
              jsplumbInstance.setTargetEnabled($element, newVal);
            });

            $scope.$watch('attr.id', (newId, oldId) => {
              $rootScope.$broadcast('jsplumb.endpoint.idChanged', newId, oldId);
            });

            $rootScope.$broadcast(
              'jsplumb.endpoint.created',
              $element.attr('id'),
              $scope.connectionIds,
              jsplumbInstance,
            );

            $scope.$on('$destroy', () => {
              jsplumbInstance.removeAllEndpoints($element);
              jsplumbInstance.remove($element);
              jsplumbInstance.repaintEverything();
            });
          });
        },
      };
    },
  };
}
