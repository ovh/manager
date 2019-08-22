import bind from 'lodash/bind';
import difference from 'lodash/difference';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import some from 'lodash/some';

import {
  STEPS,
  ROBOT_ACTION,
  FAULT_TYPES,
} from './constants';

export default () => {
  const mandatoryParameters = [
    'data',
    'faultType',
    'id',
    'status',
  ];

  class LineDiagnostic {
    /* @ngInject */
    constructor(lineDiagnostic) {
      forEach(mandatoryParameters, (parameter) => {
        if (!has(lineDiagnostic, parameter)) {
          throw new Error(`${parameter} parameter must be specified when creating a new LineDiagnostic`);
        }
      });

      this.id = lineDiagnostic.id;
      this.faultType = lineDiagnostic.faultType;
      this.status = lineDiagnostic.status;
      this.data = lineDiagnostic.data;
    }

    isLongActionInProgress() {
      return includes(ROBOT_ACTION.LONG_TIME_ACTIONS, get(this, 'data.robotAction', ''));
    }

    extractBandwidthDetails() {
      return {
        theoricalBandwidth: {
          up: get(this.data, 'lineDetails.lineCapabilities.up', '-'),
          down: get(this.data, 'lineDetails.lineCapabilities.down', '-'),
        },
        currentBandwidth: {
          up: get(this.data, 'lineDetails.connectionInfo.upstreamSync', '-'),
          down: get(this.data, 'lineDetails.connectionInfo.downstreamSync', '-'),
        },
      };
    }

    getActionsToDo() {
      return flatten(
        map(
          get(this, 'data.actionsToDo', []),
          'name',
        ),
      );
    }

    getActionsDone() {
      return get(this, 'data.actionsDone', []);
    }

    addActionDone(actionToAdd) {
      this.data.actionsDone.push(actionToAdd);
    }

    getQuestionsToAnswer() {
      return flatten(
        map(
          get(this, 'data.toAnswer', []),
          'name',
        ),
      );
    }

    hasQuestionToAnswer(questionName) {
      return includes(this.getQuestionsToAnswer(), questionName);
    }

    getQuestionOptions(questionName) {
      const question = find(this.data.toAnswer, bind('name', questionName));
      return question.possibleValues;
    }

    needAppointmentDetails() {
      const appointmentQuestions = STEPS.SOLUTION_PROPOSAL.APPOINTMENT_QUESTIONS_FORM;
      return some(
        filter(
          this.getQuestionsToAnswer(),
          toAnswer => includes(appointmentQuestions, toAnswer),
        ),
      );
    }

    hasTimePeriodQuestions() {
      const timePeriodQuestions = STEPS.SOLUTION_PROPOSAL.TIME_PERIOD_QUESTIONS;
      return !difference(timePeriodQuestions, this.getQuestionsToAnswer()).length;
    }

    getQuestionDefaultValue(questionName) {
      const question = find(this.data.toAnswer, bind('name', questionName));
      return !isUndefined(question) ? question.defaultValue : null;
    }

    setDefaultValue(answer) {
      this.data.answers[answer] = this.data.answers[answer] || this.getQuestionDefaultValue(answer);
    }

    convertToRequestParams() {
      const defaultFaultType = FAULT_TYPES.UNKNOWN;
      return {
        actionsDone: get(this.data, 'actionsDone'),
        answers: get(this.data, 'answers'),
        faultType: this.faultType || defaultFaultType,
      };
    }
  }

  return LineDiagnostic;
};
