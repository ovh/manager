angular.module("ovh-angular-proxy-request").provider("ovh-proxy-request.proxy", function () {
    "use strict";
    var self = this;
    var requestProxy = "$http";
    var pathPrefix = "/";

    this.pathPrefix = function (prefix) {
        if (prefix) {
            pathPrefix = prefix;
        }
        return pathPrefix;
    };

    this.proxy = function (proxy) {
        if (proxy !== undefined) {
            requestProxy = proxy;
        }
        return requestProxy;
    };

    this.$get = ["$injector",
        function ($injector) {
            var proxy = $injector.get(self.proxy());

            proxy.pathPrefix = function (prefix) {
                return self.pathPrefix(prefix);
            };

            return proxy;
        }
    ];
});
