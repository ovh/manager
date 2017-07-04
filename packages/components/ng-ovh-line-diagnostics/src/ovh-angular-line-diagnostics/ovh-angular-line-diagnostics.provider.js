angular.module("ovh-angular-line-diagnostics").provider("LineDiagnostics", function () {
    "use strict";
    let requestProxy = "$http";
    let translationPath = "../bower_components/ovh-angular-line-diagnostics/dist";
    let pollingApiOptions = null;
    let pathPrefix = "";

    this.setPathPrefix = (prefix) => (pathPrefix = prefix || pathPrefix);

    this.setProxy = (proxy) => (requestProxy = proxy || requestProxy);

    this.setpollingApiOptions = (apiOptions) => (pollingApiOptions = apiOptions || pollingApiOptions);

    this.setTranslationsPath = (transPath) => (translationPath = transPath || translationPath);

    this.$get = [
        "$injector",
        "Poller",
        "$translatePartialLoader",
        "$translate",
        function ($injector, Poller, $translatePartialLoader, $translate) {
            const lineDiagnosticsService = {};
            const api = $injector.get(requestProxy);

            lineDiagnosticsService.loadTranslations = function () {
                angular.forEach([translationPath], (part) => {
                    $translatePartialLoader.addPart(part);
                });

                return $translate.refresh();
            };

            lineDiagnosticsService.getSetDiagnostic = function (uriParams, datas) {
                const syncParam = { faultType: "noSync" };
                const postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});

                if (postParams && postParams.answers) {
                    _.forIn(postParams.answers, (attribut, key) => {
                        if (attribut === "true" || attribut === "false") {
                            postParams.answers[key] = postParams.answers[key] === "true";
                        }
                    });
                }
                return api.post(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/run"].join("/"), uriParams).toString(), postParams);
            };

            lineDiagnosticsService.getDeleteDiagnostic = (uriParams) => api.post(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/cancel"].join("/"), uriParams).toString());

            // lineDiagnosticsService.getDiagnosticPassRobot = function (serviceName, num) {
            //    return api.post([pathPrefix, 'line', serviceName, 'diagnostic/noSync/passRobot', num].join('/'));
            // };

            lineDiagnosticsService.getWaitingValidationDiagnostics = () => api.get([pathPrefix, "diagnostic/getWaitingValidationDiagnostics"].join("/")).then((result) => result.data, (err) => $injector.get("$q").reject(err));

            lineDiagnosticsService.pollWaitingValidationDiagnostics = () =>
                Poller.poll([pathPrefix, "diagnostic/getWaitingValidationDiagnostics"].join("/"), pollingApiOptions, {
                    namespace: "tools_validation_diagnostics",
                    method: "get",
                    interval: 30000
                });

            lineDiagnosticsService.killPollWaitingValidationDiagnostics = () => Poller.kill({ namespace: "tools_validation_diagnostics" });

            lineDiagnosticsService.validateDiagnostics = (id, datas) => api.post([pathPrefix, "diagnostic", id, "validate"].join("/"), datas).then((result) => result.data, (err) => $injector.get("$q").reject(err));

            lineDiagnosticsService.runPollGetDiagnostic = function (uriParams, datas) {
                const syncParam = { faultType: "noSync" };
                const postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});
                return Poller.poll(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/run"].join("/"), uriParams).toString(), pollingApiOptions, {
                    namespace: "tools_line_diagnostics",
                    method: "post",
                    postData: postParams,
                    interval: 5000,
                    successRule (data) {
                        return data.status !== "waitingRobot";
                    } // ,
                    // errorRule : function (data) {
                    //     console.log(data.status !== 'waitingHuman' && !!data.data.error);
                    //     return data.status !== 'waitingHuman' && !!data.data.error; //TODO review that
                    // }
                });
            };

            return lineDiagnosticsService;
        }
    ];
});
