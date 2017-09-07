angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache){
    $templateCache.put("template/progressbar/bar.html",
        "<div class=\"bar\" ng-class='type && \"bar-\" + type'></div>");
}]);
