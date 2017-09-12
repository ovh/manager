"use strict";

angular.module("ovh-angular-jsplumb-test", [
    "ovh-angular-jsplumb",
    "jquery-ui-sortable-ng"
]).controller("mainController", function ($scope, jsPlumbService) {

    var self = this;
    var jsplumbInstance = null;
    var sortInterval = null;

    this.events = [];
    this.endpoints = {
        left: {
            keys: [],
            items: {}
        },
        right: {
            keys: [],
            items: {}
        }
    };

    this.instanceOptions = {
        PaintStyle: { lineWidth: 4, strokeStyle: "#16a085" },
        HoverPaintStyle: { lineWidth: 8, strokeStyle: "#16a085" },
        MaxConnections: -1 // unlimited number of connections
    };

    this.endpointOptions = {
        left: {
            source: {
                endpoint: ["Blank", { cssClass: "left-source" }],
                anchor: [0.5, 0.5, 1, 0],
                filter: ".endpoint"
            },
            target: {
                endpoint: ["Blank", { cssClass: "left-target" }],
                anchor: [0.5, 0.5, 1, 0],
                dropOptions: {
                    accept: ".right-source"
                }
            }
        },
        right: {
            source: {
                endpoint: ["Blank", { cssClass: "right-source" }],
                anchor: [0.5, 0.5, -1, 0],
                filter: ".endpoint"
            },
            target: {
                endpoint: ["Blank", { cssClass: "right-target" }],
                anchor: [0.5, 0.5, -1, 0],
                dropOptions: {
                    accept: ".left-source"
                }
            }
        }
    };

    this.loader = {
        jsplumb: true
    };

    this.init = function () {
        jsPlumbService.jsplumbInit().then(function () {
            self.loader.jsplumb = false;
            self.events.push(new Date().toISOString() + " : jsplumb is initialized");
        });

        pushEndpoint(this.endpoints.left, {
            label: "Endpoint L1",
            id: "l1",
            connections: ["r1", "r4"],
            enabled: true
        });

        pushEndpoint(this.endpoints.left, {
            label: "Endpoint L2",
            id: "l2",
            connections: ["r3", "r4"],
            enabled: true
        });

        pushEndpoint(this.endpoints.right, {
            label: "Endpoint R1",
            id: "r1",
            connections: ["l1"],
            enabled: true
        });

        pushEndpoint(this.endpoints.right, {
            label: "Endpoint R2",
            id: "r2",
            connections: [],
            enabled: true
        });

        pushEndpoint(this.endpoints.right, {
            label: "Endpoint R3",
            id: "r3",
            connections: ["l2"],
            enabled: true
        });

        pushEndpoint(this.endpoints.right, {
            label: "Endpoint R4",
            id: "r4",
            connections: ["l1", "l2"],
            enabled: true
        });
    };

    this.action1 = function () {
        var sourceItem = this.endpoints.left.items.l1;
        var targetItem = this.endpoints.right.items.r2;

        sourceItem.connections.push(targetItem.id);
        targetItem.connections.push(sourceItem.id);
    };

    this.action2 = function () {
        this.endpoints.right.items.r2.enabled = !this.endpoints.right.items.r2.enabled;
    };

    this.action3 = function () {
        // remove r3 key from right keys endpoints
        _.remove(self.endpoints.right.keys, function (key) {
            return key === "r3";
        });
        delete self.endpoints.right.items.r3;

        // update left endpoints connections by removing r3 from connections list
        angular.forEach(this.endpoints.left.items, function (item) {
            if (item.connections && item.connections.length && item.connections.indexOf("r3") >= 0) {
                item.connections.splice(item.connections.indexOf("r3"), 1);
            }
        });
    };

    function pushEndpoint (hash, endpoint) {
        hash.keys.push(endpoint.id);
        hash.items[endpoint.id] = endpoint;
    }

    /********************************************/
    /*             JSPLUMB EVENTS               */
    /********************************************/

    $scope.$on("jsplumb.instance.created", function (evt, instance) {
        self.events.push(new Date().toISOString() + " : jsplumb instance is created");
        jsplumbInstance = instance;
    });

    $scope.$on("jsplumb.endpoint.created", function (evt, endpointId, connectionIds, instance) {
        if (instance.isSource(endpointId) && instance.isTarget(endpointId)) {
            self.events.push(new Date().toISOString() + " : jsplumb endpoint " + endpointId + " is created as source and target");
        } else if (instance.isSource(endpointId)) {
            self.events.push(new Date().toISOString() + " : jsplumb endpoint " + endpointId + " is created as source");
        } else if (instance.isTarget(endpointId)) {
            self.events.push(new Date().toISOString() + " : jsplumb endpoint " + endpointId + " is created as target");
        }
    });

    $scope.$on("jsplumb.instance.connection", function (evt, connection, sourceEndpoint, targetEndpoint, instance, originalEvent) {
        self.events.push(new Date().toISOString() + " : jsplumb connection has been created between " + connection.sourceId + " and " + connection.targetId);
        if (originalEvent) {
            if (self.endpoints.left.items[connection.sourceId]) {
                self.endpoints.left.items[connection.sourceId].connections.push(connection.targetId);
                self.endpoints.right.items[connection.targetId].connections.push(connection.sourceId);
            } else if (self.endpoints.right.items[connection.sourceId]) {
                self.endpoints.right.items[connection.sourceId].connections.push(connection.targetId);
                self.endpoints.left.items[connection.targetId].connections.push(connection.sourceId);
            }

        }
    });

    $scope.$on("jsplumb.instance.connection.click", function (evt, connection) {
        self.events.push(new Date().toISOString() + " : jsplumb connection between " + connection.sourceId + " and " + connection.targetId + " has been clicked");

        if (self.endpoints.left.items[connection.sourceId]) {
            _.remove(self.endpoints.left.items[connection.sourceId].connections, function (conn) {
                return conn === connection.targetId;
            });

            _.remove(self.endpoints.right.items[connection.targetId].connections, function (conn) {
                return conn === connection.sourceId;
            });
        } else if (self.endpoints.right.items[connection.sourceId]) {
            _.remove(self.endpoints.right.items[connection.sourceId].connections, function (conn) {
                return conn === connection.targetId;
            });

            _.remove(self.endpoints.left.items[connection.targetId].connections, function (conn) {
                return conn === connection.sourceId;
            });
        }

    });

    $scope.$on("jsplumb.instance.connection.detached", function (evt, connection) {
        self.events.push(new Date().toISOString() + " : jsplumb connection between " + connection.sourceId + " and " + connection.targetId + " has been detached");
    });

    /********************************************/
    /*             SORTABLE EVENTS              */
    /********************************************/

    function redrawConnections () {
        jsplumbInstance.repaintEverything();
    }

    $scope.$on("ui.sortable.start", function () {
        if (!sortInterval) {
            sortInterval = window.setInterval(redrawConnections, 99);
        }
    });

    $scope.$on("ui.sortable.stop", function () {
        clearInterval(sortInterval);
        sortInterval = null;
        jsplumbInstance.repaintAndRevalidateEverything();
    });

    this.init();

});
