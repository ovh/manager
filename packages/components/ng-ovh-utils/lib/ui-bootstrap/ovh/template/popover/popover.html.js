angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache){
    $templateCache.put("template/popover/popover.html",
        "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">" +
        "  <div class=\"arrow\"></div>" +
        "" +
        "  <div class=\"popover-inner\">" +
        "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>" +
        "      <div class=\"popover-content\" ng-bind=\"content\"></div>" +
        "  </div>" +
        "</div>" +
        "");
}]);
