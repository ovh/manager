"use strict";

angular.module("angular.uirouter.title", [])
.run(["$transitions", function ($transitions) {
    var originalTitle;
    $transitions.onSuccess({}, function (transition) {
        var state = transition.to();
        transition.promise.finally(function () {
            if (state.resolve && state.resolve.$title) {
                var title = transition.injector().get("$title");
                if (!originalTitle) {
                    originalTitle = document.title;
                }
                document.title = title;
            } else {
                document.title = originalTitle;
            }
        });
    });
}]);
