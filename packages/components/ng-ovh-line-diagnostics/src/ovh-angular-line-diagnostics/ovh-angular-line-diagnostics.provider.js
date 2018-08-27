angular.module("ovh-angular-line-diagnostics").provider("LineDiagnostics", function () {
    "use strict";

    let requestProxy = "$http";
    let translationPath = "../bower_components/ovh-angular-line-diagnostics/dist";
    let pollingApiOptions = null;
    let pathPrefix = "";

    this.setPathPrefix = function (prefix) {
        if (prefix) {
            pathPrefix = prefix;
        }
        return pathPrefix;
    };

    this.setProxy = function (proxy) {
        if (proxy !== undefined) {
            requestProxy = proxy;
        }
        return requestProxy;
    };

    this.setpollingApiOptions = function (apiOptions) {
        if (apiOptions !== undefined) {
            pollingApiOptions = apiOptions;
        }
        return pollingApiOptions;
    };

    this.setTranslationsPath = function (transPath) {
        if (transPath !== undefined) {
            translationPath = transPath;
        }
        return translationPath;
    };

    this.$get = ["$translatePartialLoader", "$translate", "OvhApiXdslDiagnosticLines", function ($translatePartialLoader, $translate, OvhApiXdslDiagnosticLines) {
        const lineDiagnosticsService = {};

        lineDiagnosticsService.loadTranslations = function () {
            angular.forEach([translationPath], (part) => {
                $translatePartialLoader.addPart(part);
            });

            return $translate.refresh();
        };

        lineDiagnosticsService.getRunDiagnostic = function (uriParams, datas) {
            const syncParam = { faultType: "unknown" };
            const postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});

            if (postParams && postParams.answers) {
                _.forIn(postParams.answers, (attribut, key) => {
                    if (attribut === "true" || attribut === "false") {
                        postParams.answers[key] = postParams.answers[key] === "true";
                    }
                });
            }

            return OvhApiXdslDiagnosticLines.v6().runDiagnostic(_.merge(uriParams, postParams));
        };

        lineDiagnosticsService.getCancelDiagnostic = function (uriParams) {
            return OvhApiXdslDiagnosticLines.v6().cancelDiagnostic(uriParams, { });
        };

        lineDiagnosticsService.deletePollDiagnostic = function () {
            return OvhApiXdslDiagnosticLines.v6().killPollerDiagnostic();
        };

        return lineDiagnosticsService;
    }];
});
