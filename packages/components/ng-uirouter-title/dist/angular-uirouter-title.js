"use strict";

angular.module("angular.uirouter.title", [])
.run(["$transitions", function ($transitions) {
    $transitions.onSuccess({}, function (transition) {
        transition.promise.finally(function () {
            document.title = transition.injector().get("$title");
        });
    });
}]);
