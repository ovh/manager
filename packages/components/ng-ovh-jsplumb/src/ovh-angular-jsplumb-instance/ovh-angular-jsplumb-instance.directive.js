/**
 * @ngdoc directive
 * @name ovh-angular-jsplumb.directive:jsplumbInstance
 * @scope
 * @restrict A
 * @description
 *
 * Create the jsPlumb environment
 *
 * @example
 <example module="myApp">
    <file name="script.js">
        angular.module("myApp", []);
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

        </div>
    </file>
 </example>
 */
angular.module("ovh-angular-jsplumb").directive("jsplumbInstance", function ($rootScope, $parse) {

    "use strict";

    return {
        restrict: "A",
        scope: true,
        controller: "jsplumbInstanceCtrl",
        compile: function () {
            return {
                pre: function ($scope, $element, attr, jsplumbInstanceCtrl) {

                    var instanceOptions = $parse(attr.jsplumbInstance)($scope);

                    // add class to element
                    $element.addClass("_jsPlumb_ng_instance");

                    $scope.instance = jsPlumb.getInstance(angular.extend(instanceOptions || {}, { Container: $element }));

                    /*= ==============================================
                    =            Extend jsplumb instance            =
                    ===============================================*/

                    /**
                     *  Clears the offset and size cache of each endpoints end then repaints all connections.
                     *  Useful when a connection is deleted and endpoints become empty. repaintEverything method does not repaint empty endpoints.
                     */
                    $scope.instance.revalidateEverything = function () {
                        var self = this;
                        $("._jsPlumb_ng_endpoint").each(function (index, elem) {
                            self.revalidate($(elem).attr("id"));
                        });
                    };

                    /**
                     *  Make a connection between 2 endpoints
                     */
                    $scope.instance.connectEndpoints = function (sourceId, targetId) {
                        return jsplumbInstanceCtrl.connectEndpoints(sourceId, targetId);
                    };

                    /**
                     *  Delete a connection (or by give it source and target IDs)
                     */
                    $scope.instance.disconnectEndpoints = function (sourceIdOrConnection, targetId) {
                        return jsplumbInstanceCtrl.disconnectEndpoints(sourceIdOrConnection, targetId);
                    };

                    /**
                     *  Return a jsplumb connection object by providing a source endpoint id and target endpoint id.
                     *  This method checks in both direction : from source to target or from target to source.
                     */
                    $scope.instance.getConnectionBySourceIdAndTargetId = function (sourceId, targetId) {
                        return jsplumbInstanceCtrl.getConnection(sourceId, targetId);
                    };

                    /* -----  End of Extend jsplumb instance  ------*/

                    $rootScope.$broadcast("jsplumb.instance.created", $scope.instance);

                    $scope.instance.bind("connection", function (info, originalEvent) {
                        $rootScope.$broadcast("jsplumb.instance.connection", info.connection, info.sourceEndpoint, info.targetEndpoint, $scope.instance, originalEvent);

                        // call apply only if it's not a programmatically connection
                        if (originalEvent) {
                            $scope.$apply();
                        }
                    });

                    $scope.instance.bind("mouseover", function (info, originalEvent) {
                        $rootScope.$broadcast("jsplumb.instance.connection.mouseover", info, $scope.instance, originalEvent);
                    });

                    $scope.instance.bind("mouseout", function (info, originalEvent) {
                        $rootScope.$broadcast("jsplumb.instance.connection.mouseout", info, $scope.instance, originalEvent);
                    });

                    $scope.instance.bind("beforeDrop", function (info) {
                        return jsplumbInstanceCtrl.connectionExists(info.sourceId, info.targetId) ? null : info.connection;
                    });

                    $scope.instance.bind("click", function (connection, originalEvent) {
                        $rootScope.$broadcast("jsplumb.instance.connection.click", connection, $scope.instance, originalEvent);

                        // call apply only if it's not a programmatically connection
                        if (originalEvent) {
                            $scope.$apply();
                        }
                    });

                    $scope.instance.bind("connectionDetached", function (info, originalEvent) {
                        $rootScope.$broadcast("jsplumb.instance.connection.detached", info.connection, info.sourceEndpoint, info.targetEndpoint, $scope.instance, originalEvent);

                        // call apply only if it's not a programmatically connection
                        if (originalEvent) {
                            $scope.$apply();
                        }
                    });

                }
            };
        }
    };

});
