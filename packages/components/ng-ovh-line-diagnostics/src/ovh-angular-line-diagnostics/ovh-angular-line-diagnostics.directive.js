angular.module("ovh-angular-line-diagnostics").directive("lineDiagnostics", () => {
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
        controller: [
            "$q",
            "LineDiagnostics",
            "Toast",
            "$translate",
            "$state",
            "$scope",
            function ($q, LineDiagnostics, Toast, $translate, $state, $scope) {
                const self = this;

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

                function getUriParams () {
                    const uriParams = {
                        number: self.datas.lineNumber
                    };

                    if (!_.isUndefined(self.datas.serviceName)) {
                        uriParams.serviceName = self.datas.serviceName;
                    }

                    return uriParams;
                }

                // --------INIT---------

                function init () {
                    // translations loadings
                    LineDiagnostics.loadTranslations().then(
                        () => {
                            self.translateReady = true;
                            getSetLineStep();
                        },
                        () => {
                            self.translateReady = null;
                        }
                    );
                }

                function getSetLineStep (rawDatas) {
                    let datas = rawDatas;
                    self.loaders.getLineStep = true;
                    if (self.datas.type) {
                        datas = rawDatas ? angular.extend(rawDatas, { faultType: self.datas.type }) : { faultType: self.datas.type };
                    }
                    return LineDiagnostics.getSetDiagnostic(getUriParams(), datas)
                        .then(
                            (lineStep) => {
                                if (lineStep.data.errors) {
                                    // if error, interne api return 200 status with lineStep.errors = [] ... winner code check
                                    const errors = lineStep.data.errors;
                                    self.datas.lineStep = null;
                                    let errorMessage = "";
                                    if (errors.length) {
                                        if (errors[0].context && errors[0].context.errorCode) {
                                            self.datas.error = errors[0].context.errorCode;
                                            errorMessage = $translate.instant(`tools_lineDiagnostics_error_context_${errors[0].context.errorCode}`);
                                        } else {
                                            errorMessage = `${errors[0].kind} : ${errors[0].message}`;
                                        }
                                    }
                                    Toast.error(
                                        `${$translate.instant("tools_lineDiagnostics_error", {
                                            lineNumber: self.datas.lineNumber
                                        })} ${errorMessage}`
                                    );
                                    return $q.reject(errors);
                                }

                                // case for no error, but user hasn t really make actions asked
                                if (lineStep.data && lineStep.data.data && lineStep.data.data.error === "changeProfileNotDone") {
                                    Toast.error($translate.instant(`tools_lineDiagnostics_error_context_${lineStep.data.data.error}`));
                                }
                                self.datas.lineStep = lineStep.data;
                                runPolling(lineStep.data);
                                self.formActionTodo.comment = self.datas.lineStep.data.answers.comment;
                                return lineStep;
                            },
                            (error) => {
                                self.datas.lineStep = null;
                                if (!datas) {
                                    // JEAN MICHEL style for no error code on apiv6
                                    let errorMessage = "";
                                    let errorCode = null;
                                    const errorMessageCode = (error.data && error.data.message) || ""; // errors from apiv6 without mesage code
                                    if (errorMessageCode === "line diagnostic already launched by OVH") {
                                        errorCode = "internalDiagAlreadyLaunched";
                                        errorMessage = ` ${$translate.instant(`tools_lineDiagnostics_error_context_${errorCode}`)}`;
                                    }

                                    // END JEAN MICHEL style for no error code on apiv6
                                    Toast.error(
                                        $translate.instant("tools_lineDiagnostics_error", {
                                            lineNumber: self.datas.lineNumber
                                        }) + errorMessage
                                    );
                                    self.datas.error = errorCode;
                                }
                                return $q.reject(error);
                            }
                        )
                        .finally(() => {
                            self.loaders.getLineStep = false;
                        });
                }

                function runPolling (lineStep) {
                    if (lineStep.status === "waitingRobot") {
                        LineDiagnostics.runPollGetDiagnostic(getUriParams(), self.datas.type ? { faultType: self.datas.type } : undefined).then((uLineStep) => {
                            self.datas.lineStep = uLineStep;
                        });
                    }
                }

                // --------TOOLS---------

                self.isNotEmptyObj = function (obj) {
                    return obj && Object.keys(obj).length > 0;
                };

                self.displayDoneTitle = function (answers) {
                    return !!_.find(answers, (answer, key) => answers[key] !== null);
                };

                $scope.$watch(
                    () => self.formActionTodo,
                    () => {
                        self.formActionTodo.list = Object.keys(_.omit(self.formActionTodo.values, (isChecked) => !isChecked));
                    },
                    true
                );

                function responseHandling (response) {
                    if (!response || !response.data || !!response.data.error) {
                        Toast.error(
                            `${$translate.instant("tools_lineDiagnostics_post_error", {
                                lineNumber: self.datas.lineNumber
                            })} : ${(response && response.data && response.data.error) || ""}`
                        );
                    }
                }

                // --------ACTIONS---------

                self.hasComment = () =>
                    !!_.find(self.datas.lineStep.data.toAnswer, {
                        name: "comment"
                    });

                self.dateChanged = function (object, name) {
                    // check if date and time are set
                    if (!object[`${name}date`] && !object[`${name}time`]) {
                        object[name] = undefined;
                        return;
                    }

                    // set objectName data with two part date
                    const inputDate = object[`${name}date`] || moment().format("YYYY-MM-DD");
                    const inputTime = `${object[`${name}time`] || "00:00"}:00`;
                    object[name] = `${moment(inputDate, "YYYY-MM-DD").format("YYYY-MM-DD")}T${inputTime}${moment().format("Z")}`;
                };

                self.setSearchDate = function (object, name, nbDays) {
                    // preselected date changed
                    let date = null;
                    if (nbDays === -30) {
                        date = moment().add(-1, "months");
                        object[`${name}date`] = date.format("YYYY-MM-DD");
                    } else {
                        date = moment().add(nbDays, "days");
                        object[`${name}date`] = date.format("YYYY-MM-DD");
                    }
                    if (!object[`${name}time`]) {
                        object[`${name}time`] = date.format("HH:mm");
                    }
                    self.dateChanged(object, name);
                };

                self.refreshLineStep = () => !self.loaders.getLineStep ? getSetLineStep() : null;

                self.submitActionTodo = function () {
                    self.loaders.actionTodo = true;

                    const comment = self.formActionTodo.comment ?
                        {
                            answers: {
                                comment: self.formActionTodo.comment
                            }
                        } :
                        {};

                    getSetLineStep(
                        angular.extend(
                            {
                                actionsDone: self.formActionTodo.list
                            },
                            comment
                        )
                    )
                        .then(responseHandling, () => {
                            Toast.error(
                                $translate.instant("tools_lineDiagnostics_post_error", {
                                    lineNumber: self.datas.lineNumber
                                })
                            );
                        })
                        .finally(() => {
                            self.loaders.actionTodo = false;
                        });
                };

                self.conditionRefused = () => self.formToAnswer.values.conditionsAccepted !== undefined && self.formToAnswer.values.conditionsAccepted === "false";

                self.submitToAnswer = function () {
                    self.loaders.toAnswer = true;

                    if (!self.hasComment()) {
                        self.formToAnswer.values.comment = angular.copy(self.formActionTodo.comment);
                    }
                    if (self.formToAnswer.values.otrsTicket) {
                        self.formToAnswer.values.otrsTicket = parseInt(self.formToAnswer.values.otrsTicket, 10);
                    }
                    if (self.formToAnswer.values.datetimeOfAppearancedate) {
                        delete self.formToAnswer.values.datetimeOfAppearancedate;
                    }
                    if (self.formToAnswer.values.datetimeOfAppearancetime) {
                        delete self.formToAnswer.values.datetimeOfAppearancetime;
                    }

                    getSetLineStep({
                        answers: self.formToAnswer.values
                    })
                        .then(responseHandling, () => {
                            Toast.error(
                                $translate.instant("tools_lineDiagnostics_post_error", {
                                    lineNumber: self.datas.lineNumber
                                })
                            );
                        })
                        .finally(() => {
                            self.loaders.toAnswer = false;
                        });
                };

                self.deleteDiag = function () {
                    LineDiagnostics.getDeleteDiagnostic(getUriParams()).then(() => {
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
            }
        ]
    };
});
