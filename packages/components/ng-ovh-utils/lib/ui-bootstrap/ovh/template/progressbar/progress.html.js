angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache){
    $templateCache.put("template/progressbar/progress.html",
        "<div class=\"progress\"><progressbar ng-repeat=\"bar in bars\" width=\"bar.to\" old=\"bar.from\" animate=\"bar.animate\" type=\"bar.type\"></progressbar></div>");
}]);
