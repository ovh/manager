angular.module("ovh-angular-jsplumb").controller("jsplumbInstanceCtrl", function ($scope, $timeout, $window) {
    "use strict";

    var self = this;

    this.getInstance = function () {
        return $scope.instance;
    };

    this.connectionForecast = [];

    // Make a connection between 2 endpoints
    this.connectEndpoints = function (sourceId, targetId) {
        var connection;

        // If source endpoint is disabled, temporary re-enable it
        var deactiveSourceAfterConnect = false;
        if (!$scope.instance.isSourceEnabled(sourceId)) {
            deactiveSourceAfterConnect = true;
            $scope.instance.setSourceEnabled(sourceId, true);
        }

        // If target endpoint is disabled, temporary re-enable it
        var deactiveTargetAfterConnect = false;
        if (!$scope.instance.isTargetEnabled(targetId)) {
            deactiveTargetAfterConnect = true;
            $scope.instance.setTargetEnabled(targetId, true);
        }

        // If already linked (ex: temporary/dashed connection): disconnect it
        if (self.connectionExists(sourceId, targetId)) {
            self.disconnectEndpoints(sourceId, targetId);
        }

        // Let's connect!
        connection = $scope.instance.connect({
            source: sourceId,
            target: targetId
        });

        // Re-disable target endpoint, if it was disabled
        if (deactiveTargetAfterConnect) {
            $scope.instance.setTargetEnabled(targetId, false);
        }

        // Re-disable source endpoint, if it was disabled
        if (deactiveSourceAfterConnect) {
            $scope.instance.setSourceEnabled(sourceId, false);
        }

        return connection;
    };

    // Detach connection between 2 endpoints
    this.disconnectEndpoints = function (sourceIdOrConnection, targetId) {
        var sourceId = sourceIdOrConnection;
        var connection = sourceIdOrConnection;
        if (!targetId) {
            // 1st param is a connection; so we need to get IDs
            sourceId = sourceIdOrConnection.sourceId;
            targetId = sourceIdOrConnection.targetId;
        } else {
            // Else, we have IDs, so get connection
            connection = self.getConnection(sourceId, targetId);
        }

        _.remove(self.connectionForecast, { sourceId: sourceId, targetId: targetId });

        if (connection) {
            // If source endpoint is disabled, temporary re-enable it
            var deactiveSourceAfterConnect = false;
            if (!$scope.instance.isSourceEnabled(sourceId)) {
                deactiveSourceAfterConnect = true;
                $scope.instance.setSourceEnabled(sourceId, true);
            }

            // If target endpoint is disabled, temporary re-enable it
            var deactiveTargetAfterConnect = false;
            if (!$scope.instance.isTargetEnabled(targetId)) {
                deactiveTargetAfterConnect = true;
                $scope.instance.setTargetEnabled(targetId, true);
            }

            // Let's disconnect!
            $scope.instance.detach(connection);

            // Re-disable target endpoint, if it was disabled
            if (deactiveTargetAfterConnect) {
                $scope.instance.setTargetEnabled(targetId, false);
            }

            // Re-disable source endpoint, if it was disabled
            if (deactiveSourceAfterConnect) {
                $scope.instance.setSourceEnabled(sourceId, false);
            }
        }
        return connection;
    };

    this.connectEndpointsMultiple = function (sourceId, targetList) {
        // forecast this connection
        targetList.forEach(function (id) {
            if (!_.find(self.connectionForecast, { sourceId: sourceId, targetId: id })) {
                self.connectionForecast.push({ sourceId: sourceId, targetId: id });
            }
        });

        // filter target endpoints to be sure that they are already created by jsplumb and that connection does not exists yet
        targetList = checkConnections(sourceId, targetList);

        // connect filtered endpoint target
        if (targetList.length) {
            angular.forEach(targetList, function (targetId) {
                // Let's connect!
                self.connectEndpoints(sourceId, targetId);
            });
        }
    };

    this.disconnectEndpointsMultiple = function (sourceId, targetList) {
        angular.forEach(targetList, function (targetId) {
            // Let's disconnect!
            self.disconnectEndpoints(sourceId, targetId);
        });
    };

    this.getConnection = function (sourceId, targetId) {
        var connections = $scope.instance.getAllConnections();
        return _.find(connections, { sourceId: sourceId, targetId: targetId }) || _.find(connections, { sourceId: targetId, targetId: sourceId });
    };

    this.getConnections = function (id) {
        var connections = $scope.instance.getAllConnections();
        return _.filter(connections, function (conn) {
            return (conn.sourceId === id) || (conn.targetId === id);
        });
    };

    this.connectionExists = function (sourceId, targetId) {
        return !!self.getConnection(sourceId, targetId);
    };

    function checkConnections (endpointId, endpointConnectionIds) {
        var targetList = [];

        // check if source is already linked to instance and find already created targets
        if ($scope.instance.isSource(endpointId)) {
            angular.forEach(endpointConnectionIds, function (endpointConnectionId) {
                if ($scope.instance.isTarget(endpointConnectionId)/* && self.getConnection(endpointId, endpointConnectionId) === null*/) {
                    targetList.push(endpointConnectionId);
                }
            });
        }

        return targetList;
    }

    $scope.$on("jsplumb.endpoint.idChanged", function (evt, newId, oldId) {
        // remove old connections
        if (oldId && (oldId !== newId)) {
            self.getConnections(oldId).forEach(function (conn) {
                self.disconnectEndpoints(conn.sourceId, conn.targetId);
            });
        }

        // Create new connections
        self.connectionForecast
            .filter(function (conn) {
                return (conn.sourceId === newId) || (conn.targetId === newId);
            })
            .forEach(function (conn) {
                $scope.instance.connect({
                    source: conn.sourceId,
                    target: conn.targetId
                });
            });
    });

    $scope.$on("jsplumb.endpoint.created", function (evt, endpointId, endpointConnectionIds) {
        self.connectEndpointsMultiple(endpointId, endpointConnectionIds);
    });

    var onResizePage = _.debounce(function onResizePage () {
        $timeout(function () {
            if ($scope.instance) {
                $scope.instance.revalidateEverything();
            }
        });
    }, 33);

    $scope.$on("$destroy", function () {
        if ($scope.instance) {
            $(window).off("resize", onResizePage);
            $scope.instance.reset();
        }
        $scope.instance = null;
    });

    $(window).on("resize", onResizePage);

    /**
     * window.on("resize") is not triggered when scrollbar appears and might cause a display bug.
     * We need to watch the window element to handle the scrollbar display. We also need to keep
     * the window.on("resize") binding because it will be triggered as soon as window is resized.
     */
    var windowElt = angular.element($window);
    $scope.$watch(function () {
        return {
            h: windowElt.height(),
            w: windowElt.width()
        };
    }, onResizePage, true);

    $scope.$on("jsplumb.endpoint.created", onResizePage);

});
