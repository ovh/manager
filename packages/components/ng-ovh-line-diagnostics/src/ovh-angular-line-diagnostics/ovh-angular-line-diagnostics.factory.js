/**
 *  @ngdoc object
 *  @name ovh-angular-line-diagnostics.LineDiagnostic
 *
 *  @description
 *  <p>Factory that describes a line diagnostic</p>
 *
 *  @constructor
 *  @param {Object} lineDiagnostic               Object taht represents data of current line diagnostic returned by API
 *                                               to create a new `LineDiagnostic` instance
 *  @param {Number} lineDiagnostic.id            Id of the line diagnostic
 *  @param {String} lineDiagnostic.faultType     Fault type of problem to diagnose (can be : 'noSync', 'alignment' or 'syncLossOrLowBandwidth')
 *  @param {String} lineDiagnostic.status        Current status of the line diagnostic
 */
angular.module("ovh-angular-line-diagnostics").factory("LineDiagnosticFactory", (DIAGNOSTICS_CONSTANTS) => {
    const mandatoryParameters = ["data", "faultType", "id", "status"];

    class LineDiagnostic {
        constructor (lineDiagnostic) {
            _.forEach(mandatoryParameters, (parameter) => {
                if (!_.has(lineDiagnostic, parameter)) {
                    throw new Error(`${parameter} parameter must be specified when creating a new LineDiagnostic`);
                }
            });

            this.id = lineDiagnostic.id;
            this.faultType = lineDiagnostic.faultType;
            this.status = lineDiagnostic.status;
            this.data = lineDiagnostic.data;
        }

        isLongActionInProgress () {
            return _.includes(DIAGNOSTICS_CONSTANTS.ROBOT_ACTION.LONG_TIME_ACTIONS, _.get(this, "data.robotAction", ""));
        }

        extractBandwidthDetails () {
            return {
                theoricalBandwidth: {
                    up: _.get(this.data, "lineDetails.lineCapabilities.up", "-"),
                    down: _.get(this.data, "lineDetails.lineCapabilities.down", "-")
                },
                currentBandwidth: {
                    up: _.get(this.data, "lineDetails.connectionInfo.upstreamSync", "-"),
                    down: _.get(this.data, "lineDetails.connectionInfo.downstreamSync", "-")
                }
            };
        }

        getActionsToDo () {
            const actionsToDo = _.get(this, "data.actionsToDo", []);
            return _.chain(actionsToDo)
                .map("name")
                .flatten()
                .value();
        }

        getActionsDone () {
            return _.get(this, "data.actionsDone", []);
        }

        addActionDone (actionToAdd) {
            this.data.actionsDone.push(actionToAdd);
        }

        getQuestionsToAnswer () {
            const questions = _.get(this, "data.toAnswer", []);
            return _.chain(questions)
                .map("name")
                .flatten()
                .value();
        }

        hasQuestionToAnswer (questionName) {
            return _.includes(this.getQuestionsToAnswer(), questionName);
        }

        getQuestionOptions (questionName) {
            const question = _.find(this.data.toAnswer, "name", questionName);
            return question.possibleValues;
        }

        needAppointmentDetails () {
            const appointmentQuestions = DIAGNOSTICS_CONSTANTS.STEPS.SOLUTION_PROPOSAL.APPOINTMENT_QUESTIONS_FORM;
            return _.some(_.filter(this.getQuestionsToAnswer(), (toAnswer) => _.includes(appointmentQuestions, toAnswer)));
        }

        hasTimePeriodQuestions () {
            const timePeriodQuestions = DIAGNOSTICS_CONSTANTS.STEPS.SOLUTION_PROPOSAL.TIME_PERIOD_QUESTIONS;
            return !_.difference(timePeriodQuestions, this.getQuestionsToAnswer()).length;
        }

        getQuestionDefaultValue (questionName) {
            const question = _.find(this.data.toAnswer, "name", questionName);
            return !_.isUndefined(question) ? question.defaultValue : null;
        }

        setDefaultValue (answer) {
            this.data.answers[answer] = this.data.answers[answer] || this.getQuestionDefaultValue(answer);
        }

        convertToRequestParams () {
            const defaultFaultType = DIAGNOSTICS_CONSTANTS.FAULT_TYPES.UNKNOWN;
            return {
                actionsDone: _.get(this.data, "actionsDone"),
                answers: _.get(this.data, "answers"),
                faultType: this.faultType || defaultFaultType
            };
        }
    }

    return LineDiagnostic;
});
