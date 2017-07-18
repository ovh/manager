angular.module("ovh-angular-doc-url")
    .component("ovhDocUrl", {
        template: "<a data-ng-href='{{::$ctrl.url}}' target='_blank'><span data-ng-transclude></span><i class='fa fa-external-link' aria-hidden='true'></i></a>",
        bindings: {
            docId: "@"
        },
        transclude: true,
        controller: "OvhDocUrlCtrl"
    });
