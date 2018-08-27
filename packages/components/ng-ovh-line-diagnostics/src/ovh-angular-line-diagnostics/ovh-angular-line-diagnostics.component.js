angular.module("ovh-angular-line-diagnostics").component("lineDiagnostics", {
    bindings: {
        lineNumber: "@",
        serviceName: "@"
    },
    templateUrl: "/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html",
    controller: "LineDiagnosticsCtrl"
});
