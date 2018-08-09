angular.module("ovh-angular-line-diagnostics").factory("LineDiagnosticFactory", () => {
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
            const actionsDone = _.get(this, "data.actionsDone", []);
            return _.chain(actionsDone)
                .map("name")
                .flatten()
                .value();
        }

        addActionDone (actionsToAdd) {
            if (_.isArray(actionsToAdd)) {
                this.data.actionsDone = _.union(this.data.actionsDone, actionsToAdd);
            } else {
                this.data.actionsDone.push(actionsToAdd);
            }
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

        convertToRequestParams () {
            const defaultFaultType = "unknown";
            return {
                actionsDone: this.data.actionsDone,
                answers: this.data.answers,
                faultType: this.faultType || defaultFaultType
            };
        }
    }

    return LineDiagnostic;
});
