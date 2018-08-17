angular.module("ovh-angular-line-diagnostics").factory("LineDiagnosticFactory", [
    "DIAGNOSTICS_CONSTANTS",
    (DIAGNOSTICS_CONSTANTS) => {
        const mandatoryOptions = ["data", "faultType", "id", "status"];

        class LineDiagnostic {
            constructor (lineDiagnostic) {
                _.forEach(mandatoryOptions, (option) => {
                    if (!_.has(lineDiagnostic, option)) {
                        throw new Error(`${option} option must be specified when creating a new LineDiagnostic`);
                    }
                });

                this.id = lineDiagnostic.id;
                this.faultType = lineDiagnostic.faultType;
                this.status = lineDiagnostic.status;
                this.data = lineDiagnostic.data;

                this.clearPreviousActionsDone();
            }

            hasFinishAllTests () {
                return !_.isNull(_.get(this, "data.answers.resolvedAfterTests", null));
            }

            clearPreviousActionsDone () {
                if (this.data) {
                    _.remove(this.data.actionsDone, (action) => !_.includes(this.getActionsToDo(), action));
                }
            }

            isOnSeltTest () {
                return _.isEqual(DIAGNOSTICS_CONSTANTS.ROBOT_ACTION.SELT_TEST, _.get(this, "data.robotAction", ""));
            }

            hasSeltTestDone () {
                return !_.isNull(_.get(this, "data.seltTest.status"));
            }

            getActionsToDo () {
                const actionsToDo = _.get(this, "data.actionsToDo", []);
                return _.chain(actionsToDo)
                    .map("name")
                    .flatten()
                    .value();
            }

            hasActionToDo (actionName) {
                return _.includes(this.getActionsToDo(), actionName);
            }

            getActionsDone () {
                return _.get(this, "data.actionsDone", []);
            }

            addActionDone (actionToAdd) {
                this.data.actionsDone.push(actionToAdd);
            }

            removeActionToDo (actionToRemove) {
                _.remove(this.data.actionsToDo, "name", actionToRemove);
            }

            getQuestionsToAnswerByName () {
                const questions = _.get(this, "data.toAnswer", []);
                return _.chain(questions)
                    .map("name")
                    .flatten()
                    .value();
            }

            hasQuestionToAnswer (questionName) {
                return _.includes(this.getQuestionsToAnswerByName(), questionName);
            }

            convertToRequestParams () {
                const defaultFaultType = DIAGNOSTICS_CONSTANTS.FAULT_TYPES.UNKNOWN;
                return {
                    actionsDone: this.data.actionsDone,
                    answers: this.data.answers,
                    faultType: this.faultType || defaultFaultType
                };
            }
        }

        return LineDiagnostic;
    }
]);
