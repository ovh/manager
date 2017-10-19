"use strict";

angular.module("ovh-angular-line-diagnostics", []);

angular.module("ovh-angular-line-diagnostics").provider("LineDiagnostics", function () {
    "use strict";

    var requestProxy = "$http";
    var translationPath = "../bower_components/ovh-angular-line-diagnostics/dist";
    var pollingApiOptions = null;
    var pathPrefix = "";

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

    this.$get = ["$injector", "Poller", "$translatePartialLoader", "$translate", function ($injector, Poller, $translatePartialLoader, $translate) {
        var lineDiagnosticsService = {};
        var api = $injector.get(requestProxy);

        lineDiagnosticsService.loadTranslations = function () {
            angular.forEach([translationPath], function (part) {
                $translatePartialLoader.addPart(part);
            });

            return $translate.refresh();
        };

        lineDiagnosticsService.getSetDiagnostic = function (uriParams, datas) {
            var syncParam = { faultType: "noSync" };
            var postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});

            if (postParams && postParams.answers) {
                _.forIn(postParams.answers, function (attribut, key) {
                    if (attribut === "true" || attribut === "false") {
                        postParams.answers[key] = postParams.answers[key] === "true";
                    }
                });
            }
            return api.post(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/run"].join("/"), uriParams).toString(), postParams);
        };

        lineDiagnosticsService.getDeleteDiagnostic = function (uriParams) {
            return api.post(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/cancel"].join("/"), uriParams).toString());
        };

        // lineDiagnosticsService.getDiagnosticPassRobot = function (serviceName, num) {
        //    return api.post([pathPrefix, 'line', serviceName, 'diagnostic/noSync/passRobot', num].join('/'));
        // };

        lineDiagnosticsService.getWaitingValidationDiagnostics = function () {
            var $q = $injector.get("$q");
            return api.get([pathPrefix, "diagnostic/getWaitingValidationDiagnostics"].join("/")).then(function (result) {
                return result.data;
            }, function (err) {
                return $q.reject(err);
            });
        };

        lineDiagnosticsService.pollWaitingValidationDiagnostics = function () {
            return Poller.poll([pathPrefix, "diagnostic/getWaitingValidationDiagnostics"].join("/"), pollingApiOptions, {
                namespace: "tools_validation_diagnostics",
                method: "get",
                interval: 30000
            });
        };

        lineDiagnosticsService.killPollWaitingValidationDiagnostics = function () {
            Poller.kill({ namespace: "tools_validation_diagnostics" });
        };

        lineDiagnosticsService.validateDiagnostics = function (id, datas) {
            var $q = $injector.get("$q");
            return api.post([pathPrefix, "diagnostic", id, "validate"].join("/"), datas).then(function (result) {
                return result.data;
            }, function (err) {
                return $q.reject(err);
            });
        };

        lineDiagnosticsService.runPollGetDiagnostic = function (uriParams, datas) {
            var syncParam = { faultType: "noSync" };
            var postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});
            return Poller.poll(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/run"].join("/"), uriParams).toString(), pollingApiOptions, {
                namespace: "tools_line_diagnostics",
                method: "post",
                postData: postParams,
                interval: 5000,
                successRule: function successRule(data) {
                    return data.status !== "waitingRobot";
                } // ,
                // errorRule : function (data) {
                //     console.log(data.status !== 'waitingHuman' && !!data.data.error);
                //     return data.status !== 'waitingHuman' && !!data.data.error; //TODO review that
                // }

            });
        };

        return lineDiagnosticsService;
    }];
});

angular.module("ovh-angular-line-diagnostics").directive("lineDiagnostics", function () {
    "use strict";

    return {
        restrict: "EA",
        templateUrl: "/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html",
        controllerAs: "LinediagnosticsCtrl",
        bindToController: true,
        scope: {
            lineDiagnostics: "@",
            lineDiagnosticsType: "@",
            serviceName: "@lineDiagnosticsServiceName"
        },
        controller: ["$q", "LineDiagnostics", "Toast", "$translate", "$state", "$scope", function ($q, LineDiagnostics, Toast, $translate, $state, $scope) {

            var self = this;

            self.translateReady = false;

            self.loaders = {
                getLineStep: false,
                actionTodo: false,
                toAnswer: false
            };

            self.datas = {
                lineStep: {},
                lineNumber: self.lineDiagnostics,
                type: self.lineDiagnosticsType,
                serviceName: self.serviceName
            };

            self.formActionTodo = {
                values: {}, // Load by actionTodo in self.datas.lineStep.data
                list: [],
                comment: ""
            };

            self.formToAnswer = {
                values: {} // Load by toAnswer in self.datas.lineStep.data.toAnswer
            };

            // --------URI PARAMS---------

            function getUriParams() {
                var uriParams = {
                    number: self.datas.lineNumber
                };

                if (!_.isUndefined(self.datas.serviceName)) {
                    uriParams.serviceName = self.datas.serviceName;
                }

                return uriParams;
            }

            // --------INIT---------

            function init() {
                // translations loadings
                LineDiagnostics.loadTranslations().then(function () {
                    self.translateReady = true;
                    getSetLineStep();
                }, function () {
                    self.translateReady = null;
                });
            }

            function getSetLineStep(paramDatas) {
                var datas = paramDatas;
                self.loaders.getLineStep = true;
                if (self.datas.type) {
                    datas = datas ? angular.extend(datas, { faultType: self.datas.type }) : { faultType: self.datas.type };
                }
                return LineDiagnostics.getSetDiagnostic(getUriParams(), datas).then(function (lineStep) {
                    if (lineStep.data.errors) {
                        // if error, interne api return 200 status with lineStep.errors = [] ... winner code check
                        var errors = lineStep.data.errors;
                        self.datas.lineStep = null;
                        var errorMessage = "";
                        if (errors.length) {
                            if (errors[0].context && errors[0].context.errorCode) {
                                self.datas.error = errors[0].context.errorCode;
                                errorMessage = $translate.instant("tools_lineDiagnostics_error_context_" + errors[0].context.errorCode);
                            } else {
                                errorMessage = errors[0].kind + " : " + errors[0].message;
                            }
                        }
                        Toast.error($translate.instant("tools_lineDiagnostics_error", { lineNumber: self.datas.lineNumber }) + " " + errorMessage);
                        return $q.reject(errors);
                    }
                    var errorAllow = ["changeProfileNotDone", "ovhTicketInvalid", "monitoringTodoAlreadyExists"];

                    // case for no error, but user hasn t really make actions asked
                    if (lineStep.data && lineStep.data.data && lineStep.data.data.error && errorAllow.indexOf(lineStep.data.data.error) !== -1) {
                        Toast.error($translate.instant("tools_lineDiagnostics_error_context_" + lineStep.data.data.error));
                    }
                    self.datas.lineStep = lineStep.data;
                    runPolling(lineStep.data);
                    self.formActionTodo.comment = self.datas.lineStep.data.answers.comment;
                    return lineStep;
                }, function (error) {
                    self.datas.lineStep = null;
                    if (!datas) {
                        // JEAN MICHEL style for no error code on apiv6
                        var errorMessage = "";
                        var errorCode = null;
                        var errorMessageCode = error.data && error.data.message || ""; // errors from apiv6 without mesage cogde
                        if (errorMessageCode === "line diagnostic already launched by OVH") {
                            errorCode = "internalDiagAlreadyLaunched";
                            errorMessage = " " + $translate.instant("tools_lineDiagnostics_error_context_" + errorCode);
                        }

                        // END JEAN MICHEL style for no error code on apiv6
                        Toast.error($translate.instant("tools_lineDiagnostics_error", { lineNumber: self.datas.lineNumber }) + errorMessage);
                        self.datas.error = errorCode;
                    }
                    return $q.reject(error);
                }).finally(function () {
                    self.loaders.getLineStep = false;
                });
            }

            function runPolling(lineStep) {
                if (lineStep.status === "waitingRobot") {
                    LineDiagnostics.runPollGetDiagnostic(getUriParams(), self.datas.type ? { faultType: self.datas.type } : undefined).then(function (lineStepParam) {
                        self.datas.lineStep = lineStepParam;
                    });
                }
            }

            // --------TOOLS---------

            self.isNotEmptyObj = function (obj) {
                return obj && Object.keys(obj).length > 0;
            };

            self.displayDoneTitle = function (answers) {
                return !!_.find(answers, function (answer, key) {
                    return answers[key] !== null;
                });
            };

            $scope.$watch(function () {
                return self.formActionTodo;
            }, function () {
                self.formActionTodo.list = Object.keys(_.omit(self.formActionTodo.values, function (isChecked) {
                    return !isChecked;
                }));
            }, true);

            function responseHandling(response) {
                if (!response || !response.data || !!response.data.error) {
                    Toast.error($translate.instant("tools_lineDiagnostics_post_error", { lineNumber: self.datas.lineNumber }) + " : " + (response && response.data && response.data.error || ""));
                }
            }

            // --------ACTIONS---------

            self.hasComment = function () {
                return !!_.find(self.datas.lineStep.data.toAnswer, { name: "comment" });
            };

            self.dateChanged = function (object, name) {
                // check if date and time are set
                if (!object[name + "date"] && !object[name + "time"]) {
                    object[name] = undefined;
                    return;
                }

                // set objectName data with two part date
                var inputDate = object[name + "date"] || moment().format("YYYY-MM-DD");
                var inputTime = (object[name + "time"] || "00:00") + ":00";
                object[name] = moment(inputDate, "YYYY-MM-DD").format("YYYY-MM-DD") + "T" + inputTime + moment().format("Z");
            };

            self.setSearchDate = function (object, name, nbDays) {
                // preselected date changed
                var date = null;
                if (nbDays === -30) {
                    date = moment().add(-1, "months");
                    object[name + "date"] = date.format("YYYY-MM-DD");
                } else {
                    date = moment().add(nbDays, "days");
                    object[name + "date"] = date.format("YYYY-MM-DD");
                }
                if (!object[name + "time"]) {
                    object[name + "time"] = date.format("HH:mm");
                }
                self.dateChanged(object, name);
            };

            self.refreshLineStep = function () {
                if (!self.loaders.getLineStep) {
                    getSetLineStep();
                }
            };

            self.submitActionTodo = function () {
                self.loaders.actionTodo = true;

                var comment = self.formActionTodo.comment ? {
                    answers: {
                        comment: self.formActionTodo.comment
                    }
                } : {};

                getSetLineStep(angular.extend({
                    actionsDone: self.formActionTodo.list
                }, comment)).then(responseHandling, function () {
                    Toast.error($translate.instant("tools_lineDiagnostics_post_error", { lineNumber: self.datas.lineNumber }));
                }).finally(function () {
                    self.loaders.actionTodo = false;
                });
            };

            self.conditionRefused = function () {
                return self.formToAnswer.values.conditionsAccepted !== undefined && self.formToAnswer.values.conditionsAccepted === "false";
            };

            self.submitToAnswer = function () {
                self.loaders.toAnswer = true;

                if (!self.hasComment()) {
                    self.formToAnswer.values.comment = angular.copy(self.formActionTodo.comment);
                }
                if (self.formToAnswer.values.ovhTicket) {
                    self.formToAnswer.values.ovhTicket = parseInt(self.formToAnswer.values.ovhTicket, 10);
                }
                if (self.formToAnswer.values.datetimeOfAppearancedate) {
                    delete self.formToAnswer.values.datetimeOfAppearancedate;
                }
                if (self.formToAnswer.values.datetimeOfAppearancetime) {
                    delete self.formToAnswer.values.datetimeOfAppearancetime;
                }

                getSetLineStep({
                    answers: self.formToAnswer.values
                }).then(responseHandling, function () {
                    Toast.error($translate.instant("tools_lineDiagnostics_post_error", { lineNumber: self.datas.lineNumber }));
                }).finally(function () {
                    self.loaders.toAnswer = false;
                });
            };

            self.deleteDiag = function () {
                LineDiagnostics.getDeleteDiagnostic(getUriParams()).then(function () {
                    $state.reload();
                });
            };

            // --------DEBUG---------

            /* self.bypassRobot = function (num) {
            LineDiagnostics.getDiagnosticPassRobot(self.datas.lineNumber, num);
            };
            self.deleteDiag = function () {
            LineDiagnostics.getDeleteDiagnostic(self.datas.lineNumber).then(function () {
                $state.reload();
            });
            };*/

            init();
        }]

    };
});

angular.module('ovh-angular-line-diagnostics').run(['$templateCache', function ($templateCache) {
    'use strict';

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html', "<div id=line-diagnostics data-ng-if=\"LinediagnosticsCtrl.translateReady === false || LinediagnosticsCtrl.loaders.getLineStep === true\"><div class=text-center><spinner></spinner></div></div><div id=line-diagnostics data-ng-if=\"LinediagnosticsCtrl.translateReady === null\"><div class=text-center>LOADING ERROR</div></div><div id=line-diagnostics data-ng-if=\"LinediagnosticsCtrl.translateReady === true && LinediagnosticsCtrl.loaders.getLineStep === false\"><h1>{{'tools_lineDiagnostics_title' | translate}}</h1><div class=\"alert alert-danger top-space-m20 text-center\" role=alert data-ng-if=\"LinediagnosticsCtrl.datas.lineStep === null\"><p><i class=\"ovh-font ovh-font-failure right-space-m8\"></i> <span data-translate=tools_lineDiagnostics_error data-translate-values=\"{lineNumber : LinediagnosticsCtrl.datas.lineNumber}\"></span><div data-ng-if=LinediagnosticsCtrl.datas.error><span data-translate=\"{{('tools_lineDiagnostics_error_context_' + LinediagnosticsCtrl.datas.error | translate) || '' }}\"></span></div></p><button data-ng-click=LinediagnosticsCtrl.refreshLineStep(); data-ng-disabled=LinediagnosticsCtrl.loaders.getLineStep type=button class=\"btn btn-default top-space-m12\" title=\"{{::'support_ticket_refresh' | translate}}\"><i data-ng-hide=LinediagnosticsCtrl.loaders.getLineStep class=\"fa fa-refresh\"></i><spinner data-ng-show=LinediagnosticsCtrl.loaders.getLineStep></spinner><span data-translate=tools_lineDiagnostics_refresh></span></button></div><div data-ng-if=\"LinediagnosticsCtrl.datas.lineStep !== null\"><div class=line-diagnostics-detail data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.status && (!LinediagnosticsCtrl.datas.type || LinediagnosticsCtrl.datas.type==='noSync')\"><h2 data-translate=tools_lineDiagnostics_testselt_title></h2><div class=bottom-space-m16 data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.status === 'failed'\"><i class=\"ovh-font ovh-font-failure fs16 text-danger\"></i> <span data-translate=tools_lineDiagnostics_testselt_error></span></div><div class=bottom-space-m16 data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.status !== 'failed'\"><i class=\"ovh-font ovh-font-success fs16 text-success\"></i> <span data-translate=tools_lineDiagnostics_testselt_status></span></div><div class=row data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.status !== 'failed'\"><p class=\"col-xs-12 col-md-3 bodyText2\" data-translate=tools_lineDiagnostics_testselt_date></p><p class=\"col-xs-12 col-md-9\" data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.date || '-'\"></p></div><div class=row><p class=\"col-xs-12 col-md-3 bodyText2\" data-translate=tools_lineDiagnostics_detail_lastSync></p><p class=\"col-xs-12 col-md-9\" data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lastSync || '-'\"></p></div><div class=row><div class=\"col-xs-12 LineScheme\"><div class=infosNRA><dl><i class=\"ovh-font ovh-font-nra\"></i><dt class=bodyText2 data-translate=tools_lineDiagnostics_detail_NRAName></dt><dd data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.nra || '-'\"></dd><dt class=bodyText2 data-translate=tools_lineDiagnostics_detail_operator></dt><dd data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.operator || '-'\"></dd></dl></div><div class=infosClientSide><dl><dt class=sr-only data-translate=tools_lineDiagnostics_detail_accessType></dt><dd data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lineType==='sdsl'\"><i title={{::LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lineType}} class=\"ovh-font ovh-font-telecom-sdsl\"></i></dd><dd data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lineType==='adsl'\"><i title={{::LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lineType}} class=\"ovh-font ovh-font-xdsl-adsl\"></i></dd><dd data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lineType==='vdsl'\"><i title={{::LinediagnosticsCtrl.datas.lineStep.data.lineDetails.lineType}} class=\"ovh-font ovh-font-xdsl-vdsl\"></i></dd><dt class=bodyText2 data-translate=tools_lineDiagnostics_detail_accessName></dt><dd data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.accessName || '-'\"></dd><dt class=bodyText2 data-translate=tools_lineDiagnostics_detail_address></dt><dd data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.address || '-'\"></dd></dl></div><div class=linePart><div class=lineDistances><div class=lineLength><div class=arrowPart></div><dl><dt class=sr-only data-translate=tools_lineDiagnostics_detail_NRADistance></dt><dd data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.lineDetails.length ? LinediagnosticsCtrl.datas.lineStep.data.lineDetails.length + 'm' : '-'\"></dd></dl><div class=arrowPart></div></div><div class=distanceIndicators></div></div><div class=locPb data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.status !== 'failed'\"><div class=locPbContainer><div class=pbIcon><i class=\"ovh-font ovh-font-failure fs20 text-danger\"></i></div><div class=\"problemDescription left-space-p12\"><h3>{{'tools_lineDiagnostics_testselt_state_' + LinediagnosticsCtrl.datas.lineStep.data.seltTest.state | translate}} {{' tools_lineDiagnostics_testselt_preloc_' + LinediagnosticsCtrl.datas.lineStep.data.seltTest.preloc | translate}}</h3><p><span class=bodyText2 data-translate=tools_lineDiagnostics_testselt_distance></span> : <span data-ng-bind=\"LinediagnosticsCtrl.datas.lineStep.data.seltTest.distance ? LinediagnosticsCtrl.datas.lineStep.data.seltTest.distance + 'm' : '-'\"></span></p></div></div></div></div></div></div></div><div data-ng-if=LinediagnosticsCtrl.datas.lineStep.data.actionsDone.length><h2 data-translate=tools_lineDiagnostics_actionDone_title></h2><div class=line-diagnostics-detail><ul class=list-unstyled><li class=bottom-space-m12 data-ng-repeat=\"actionsDone in LinediagnosticsCtrl.datas.lineStep.data.actionsDone\"><i class=\"ovh-font ovh-font-success fs16 text-success\"></i> <span class=left-space-p8>{{::'tools_lineDiagnostics_action_' + actionsDone | translate}}</span></li></ul></div></div><div data-ng-if=\"LinediagnosticsCtrl.isNotEmptyObj(LinediagnosticsCtrl.datas.lineStep.data.answers) && LinediagnosticsCtrl.displayDoneTitle(LinediagnosticsCtrl.datas.lineStep.data.answers)\"><h2 data-translate=tools_lineDiagnostics_answers_title></h2><div class=line-diagnostics-detail><div class=\"form-horizontal full-height\"><div class=form-group data-ng-repeat=\"(key, answers) in LinediagnosticsCtrl.datas.lineStep.data.answers\" data-ng-if=\"answers!==null\"><label class=\"col-xs-12 col-md-6 bodyText2 top-space-p0\">{{::'tools_lineDiagnostics_answers_' + key | translate}}</label><div class=\"col-xs-12 col-md-6\"><span data-ng-if=\"key!=='comment'\" data-ng-bind=\"(answers ? 'tools_lineDiagnostics_detail_yes' : 'tools_lineDiagnostics_detail_no') | translate\"></span> <span data-ng-if=\"key==='comment'\" data-ng-bind=\"answers ? answers : ('tools_lineDiagnostics_detail_no' | translate)\"></span></div></div></div></div></div><div class=rightPanel data-ng-if=LinediagnosticsCtrl.datas.lineStep.data.actionsToDo.length><h2 data-translate=tools_lineDiagnostics_todo_title></h2><div class=line-diagnostics-detail><form class=\"full-height clearfix\" name=formActionTodo novalidate><div class=checkbox data-ng-repeat=\"actionTodo in LinediagnosticsCtrl.datas.lineStep.data.actionsToDo\"><label><input type=checkbox data-ng-required=true data-ng-model=LinediagnosticsCtrl.formActionTodo.values[actionTodo.name]> {{::'tools_lineDiagnostics_action_' + actionTodo.name | translate}}</label></div><div class=\"form-group comment\"><label for=formActionTodo_comment class=control-label>{{::'tools_lineDiagnostics_toanswer_comment' | translate}}</label><div><textarea id=formActionTodo_comment name=formActionTodo_comment class=\"form-control vertical-resize\" ng-maxlength=200 rows=\"{{ !!toAnswer.defaultValue ? 1 : 5}}\" data-ng-model=LinediagnosticsCtrl.formActionTodo.comment></textarea></div></div><button type=button class=\"btn btn-default\" data-ng-click=LinediagnosticsCtrl.deleteDiag()><span data-translate=tools_lineDiagnostics_delete_button></span></button> <button type=button class=\"btn btn-primary pull-right\" data-ng-disabled=formActionTodo.$invalid data-ng-click=LinediagnosticsCtrl.submitActionTodo()><spinner data-ng-show=LinediagnosticsCtrl.loaders.actionTodo></spinner><span data-translate=tools_lineDiagnostics_next_button></span></button></form></div></div><div class=rightPanel data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.data.toAnswer.length && LinediagnosticsCtrl.datas.lineStep.status === 'waitingHuman'\"><h2 data-translate=tools_lineDiagnostics_toanswer_title></h2><div class=line-diagnostics-detail><form class=\"full-height clearfix\" name=formToAnswer novalidate><div data-ng-repeat=\"toAnswer in LinediagnosticsCtrl.datas.lineStep.data.toAnswer\"><div class=form-group data-ng-if=\"toAnswer.type==='boolean'\"><div data-ng-if=\"toAnswer.name==='conditionsAccepted'\" class=inline style=margin-right:5px><label class=\"block pointer\"><flat-checkbox><input type=checkbox data-ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] name=\"checkbox{{ toAnswer.name}}\" id=\"checkbox{{ toAnswer.name }}\" ng-required=\"toAnswer.required\"></flat-checkbox><span class=left-space-m8>{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></span></label></div><p data-ng-if=\"toAnswer.name!=='conditionsAccepted'\">{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></p><div data-ng-if=\"toAnswer.name!=='conditionsAccepted'\" class=row><div class=col-xs-6><label><flat-radio class=pointer><input value=true type=radio ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] ng-required=toAnswer.required></flat-radio><span class=left-space-m12 data-translate=tools_lineDiagnostics_detail_yes></span></label></div><div class=col-xs-6><label><flat-radio class=pointer><input value=false type=radio ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] ng-required=toAnswer.required></flat-radio><span class=left-space-m12 data-translate=tools_lineDiagnostics_detail_no></span></label></div></div></div><div class=form-group data-ng-if=\"toAnswer.type==='string'\" data-ng-init=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] = toAnswer.defaultValue || '' \"><label for=formToAnswer_{{toAnswer.name}} class=control-label>{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></label><div><textarea id=formToAnswer_{{::toAnswer.name}} name=formToAnswer_{{::toAnswer.name}} class=\"form-control vertical-resize\" rows=\"{{ !!toAnswer.defaultValue ? 1 : 5}}\" data-ng-required=toAnswer.required data-ng-pattern=toAnswer.pattern data-ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name]></textarea></div></div><div class=form-group data-ng-if=\"toAnswer.type==='long'\" data-ng-init=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] = toAnswer.defaultValue || '' \"><label for=formToAnswer_{{toAnswer.name}} class=control-label>{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></label><div><input pattern=[0-9]{1,8} id=formToAnswer_{{::toAnswer.name}} name=formToAnswer_{{::toAnswer.name}} data-ng-required=toAnswer.required data-ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name]></div></div><div class=form-group data-ng-if=\"toAnswer.type==='enum'\" data-ng-init=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] = toAnswer.defaultValue || '' \"><label for=formToAnswer_{{toAnswer.name}} class=control-label>{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></label><div><select id=formToAnswer_{{::toAnswer.name}} name=formToAnswer_{{::toAnswer.name}} class=\"form-control no-space\" data-ng-options=\" ('tools_lineDiagnostics_toanswer_' + toAnswer.name + '_enum_' + value | translate ) for value in toAnswer.enumValues\" data-ng-required=toAnswer.required data-ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name]><option data-ng-if=!toAnswer.required value=\"\"></option></select></div></div><div class=form-group data-ng-if=\"toAnswer.type==='datetime'\" data-ng-init=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name] = toAnswer.defaultValue || '' \"><div class=row><div class=col-sm-12><label for=formToAnswer_{{toAnswer.name}}_date class=control-label>{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></label></div><div class=col-sm-7><div class=input-group><div class=input-group-btn><div class=btn-group data-uib-dropdown is-open=datepick.isopen><button id=datepick_choices type=button class=\"btn btn-default btn-sm\" data-uib-dropdown-toggle><i class=\"fa fa-calendar-o\"></i></button><ul data-uib-dropdown-menu><li role=menuitem><button class=\"full-width no-style text-left\" type=button data-ng-click=\"LinediagnosticsCtrl.setSearchDate(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name, 0); datepick.isopen=false;\" data-translate=tools_lineDiagnostics_date_now></button></li><li role=menuitem><button class=\"full-width no-style text-left\" type=button data-ng-click=\"LinediagnosticsCtrl.setSearchDate(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name, -1); datepick.isopen=false;\" data-translate=tools_lineDiagnostics_date_yesterday></button></li><li role=menuitem><button class=\"full-width no-style text-left\" type=button data-ng-click=\"LinediagnosticsCtrl.setSearchDate(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name, -3); datepick.isopen=false;\" data-translate=tools_lineDiagnostics_date_3d></button></li><li role=menuitem><button class=\"full-width no-style text-left\" type=button data-ng-click=\"LinediagnosticsCtrl.setSearchDate(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name, -7); datepick.isopen=false;\" data-translate=tools_lineDiagnostics_date_1w></button></li><li role=menuitem><button class=\"full-width no-style text-left\" type=button data-ng-click=\"LinediagnosticsCtrl.setSearchDate(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name, -30); datepick.isopen=false;\" data-translate=tools_lineDiagnostics_date_1m></button></li></ul></div></div><input class=form-control id=formToAnswer_{{toAnswer.name}}_date placeholder=YYYY-MM-DD pattern=[0-9]{4}-[0-9]{2}-[0-9]{2} data-ng-change=\"LinediagnosticsCtrl.dateChanged(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name)\" data-ng-model=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name+'date']\" data-ng-required=toAnswer.required> <span class=input-group-btn data-ng-show=\"!!LinediagnosticsCtrl.formToAnswer.values[toAnswer.name+'date']\"><button class=\"btn btn-default btn-sm\" type=button data-ng-click=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name+'date']=null;\"><i class=\"fa fa-times\"></i></button></span></div></div><div class=col-sm-5><div class=input-group><input class=form-control placeholder=HH:mm pattern=[0-9]{2}:[0-9]{2} id=formToAnswer_{{::toAnswer.name}} name=formToAnswer_{{::toAnswer.name}} data-ng-required=toAnswer.required data-ng-change=\"LinediagnosticsCtrl.dateChanged(LinediagnosticsCtrl.formToAnswer.values, toAnswer.name)\" data-ng-model=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name+'time']\"><span class=input-group-btn data-ng-show=\"!!LinediagnosticsCtrl.formToAnswer.values[toAnswer.name+'time']\"><button class=\"btn btn-default btn-sm\" type=button data-ng-click=\"LinediagnosticsCtrl.formToAnswer.values[toAnswer.name+'time']=null;\"><i class=\"fa fa-times\"></i></button></span></div></div></div></div><div class=form-group data-ng-if=toAnswer.possibleValues.length><label for=formToAnswer_{{toAnswer.name}} class=control-label>{{::'tools_lineDiagnostics_toanswer_' + toAnswer.name | translate}} <span class=red data-ng-if=toAnswer.required>*</span></label><div><select id=formToAnswer_{{::toAnswer.name}} name=formToAnswer_{{::toAnswer.name}} class=\"form-control no-space\" data-ng-options=\"value.id as value.label for value in toAnswer.possibleValues\" data-ng-required=toAnswer.required data-ng-model=LinediagnosticsCtrl.formToAnswer.values[toAnswer.name]><option data-ng-if=!toAnswer.required value=\"\"></option></select></div></div></div><div data-ng-if=!LinediagnosticsCtrl.hasComment()><div class=form-group><label for=formActionTodo_comment class=control-label>{{::'tools_lineDiagnostics_toanswer_comment' | translate}}</label><div><textarea id=formActionTodo_comment name=formActionTodo_comment class=\"form-control vertical-resize\" rows=\"{{ !!toAnswer.defaultValue ? 1 : 5}}\" data-ng-model=LinediagnosticsCtrl.formActionTodo.comment></textarea></div></div></div><button type=button class=\"btn btn-default\" data-ng-click=LinediagnosticsCtrl.deleteDiag() data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status !== 'problem'\"><span data-translate=tools_lineDiagnostics_delete_button></span></button> <button type=button class=\"btn btn-primary pull-right\" data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status !== 'problem'\" data-ng-disabled=\"formToAnswer.$invalid || LinediagnosticsCtrl.conditionRefused()\" data-ng-click=LinediagnosticsCtrl.submitToAnswer()><spinner data-ng-show=LinediagnosticsCtrl.loaders.toAnswer></spinner><span data-translate=tools_lineDiagnostics_next_button></span></button></form></div></div><div class=line-diagnostics-detail data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status !== 'waitingHuman'\"><div class=\"alert text-center\" data-ng-class=\"{\n" + "                    'alert-info' : LinediagnosticsCtrl.datas.lineStep.status === 'waitingRobot'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'sleeping'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'waitingValidation'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'cancelled'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'haveToConnectModemOnTheRightPlug'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'noSyncFaultDiagnosticRequired'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'connectionProblem',\n" + "\n" + "                    'alert-danger' : LinediagnosticsCtrl.datas.lineStep.status === 'problem'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'validationRefused',\n" + "\n" + "                    'alert-success' : LinediagnosticsCtrl.datas.lineStep.status === 'resolvedAfterTests'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'interventionRequested'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'noBandwidthFault'\n" + "                                || LinediagnosticsCtrl.datas.lineStep.status === 'noProblemAnymore'\n" + "                }\" role=alert><p><i data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'waitingRobot'\n" + "                        || LinediagnosticsCtrl.datas.lineStep.status === 'sleeping'\n" + "                        || LinediagnosticsCtrl.datas.lineStep.status === 'waitingValidation'\" class=\"ovh-font ovh-font-inprogress right-space-m8\"></i> <i data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'validationRefused'\" class=\"ovh-font ovh-font-failure\"></i> <i data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'cancelled'\" class=\"ovh-font ovh-font-failure\"></i> <i data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'problem'\" class=\"ovh-font ovh-font-warning\"></i> <i data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'resolvedAfterTests'\n" + "                        || LinediagnosticsCtrl.datas.lineStep.status === 'interventionRequested'\" class=\"ovh-font ovh-font-success\"></i> <span data-translate=tools_lineDiagnostics_robot_{{LinediagnosticsCtrl.datas.lineStep.status}}></span> <span data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'problem' &&\n" + "                        LinediagnosticsCtrl.datas.lineStep.data.error && LinediagnosticsCtrl.datas.lineStep.data.ovhTicket\" data-translate=tools_lineDiagnostics_robot_problem_ticket data-translate-values=\"{ovhTicket : LinediagnosticsCtrl.datas.lineStep.data.ovhTicket}\"></span><div data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status==='interventionRequested' &&\n" + "                        LinediagnosticsCtrl.datas.lineStep.data.ovhTicket\"><span class=bold data-translate=tools_lineDiagnostics_robot_interventionRequested_otrsticket data-translate-values=\"{ovhTicket : LinediagnosticsCtrl.datas.lineStep.data.ovhTicket}\"></span></div><div data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status==='interventionRequested' &&\n" + "                        LinediagnosticsCtrl.datas.lineStep.data.operatorTicketId\"><span class=bold data-translate=tools_lineDiagnostics_robot_interventionRequested_operatorticketid data-translate-values=\"{operatorTicketId : LinediagnosticsCtrl.datas.lineStep.data.operatorTicketId}\"></span></div><div data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status==='interventionRequested' &&\n" + "                        LinediagnosticsCtrl.datas.lineStep.data.ovhInterventionId\"><span class=bold data-translate=tools_lineDiagnostics_robot_interventionRequested_ovhinterventionid data-translate-values=\"{ovhInterventionId : LinediagnosticsCtrl.datas.lineStep.data.ovhInterventionId}\"></span></div><span data-ng-if=!!LinediagnosticsCtrl.datas.lineStep.data.robotAction>({{'tools_lineDiagnostics_robotAction_' + LinediagnosticsCtrl.datas.lineStep.data.robotAction | translate}})</span></p></div><button type=button class=\"btn btn-default\" data-ng-if=\"LinediagnosticsCtrl.datas.lineStep.status === 'problem'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.status === 'validationRefused'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.status === 'resolvedAfterTests'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.status === 'interventionRequested'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.status === 'haveToConnectModemOnTheRightPlug'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.status === 'noSyncFaultDiagnosticRequired'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.status === 'connectionProblem'\n" + "                    || LinediagnosticsCtrl.datas.lineStep.data.isInternal\" data-ng-click=LinediagnosticsCtrl.deleteDiag()><span data-translate=tools_lineDiagnostics_delete_button></span></button></div></div></div>");
}]);
//# sourceMappingURL=ovh-angular-line-diagnostics.js.map
