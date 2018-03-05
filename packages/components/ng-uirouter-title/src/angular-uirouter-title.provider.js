"use strict";

angular.module("angular.uirouter.title", [])
.run(["$q", "$transitions", "$injector", function ($q, $transitions, $injector) {
    var originalTitle;
    $transitions.onSuccess({}, function (transition) {
        var state = transition.to();
        if (state.resolve && angular.isFunction(state.resolve.$title)) {
            return $q.when($injector.invoke(state.resolve.$title)).then(function (title) {
                if (!originalTitle) {
                    originalTitle = document.title;
                }
                document.title = title;
            });
        } else {
            document.title = originalTitle;
        }
    });
}]);
