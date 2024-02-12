import camelCase from 'lodash/camelCase';
import clone from 'lodash/clone';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import { ALERTER_ID } from '../operation-table/operation-table.constants';

angular.module('App').controller(
  'DomainOperationProgressCtrl',
  class DomainOperationProgressCtrl {
    constructor($stateParams, $translate, Alerter, domainOperationService) {
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Operation = domainOperationService;
    }

    $onInit() {
      this.currentStepIndex = 0;
      this.loading = false;
      this.progress = null;
      this.steps = [
        { name: 'contactsConfirmation', active: false, position: 17 },
        {
          name: 'confirmationOfTheCurrentRegistrar',
          active: false,
          position: 50,
        },
        { name: 'finalizationOfTheTransfer', active: false, position: 84 },
      ];

      this.getProgress();
    }

    getProgress() {
      this.loading = true;
      return this.Operation.getDomainOperation(this.$stateParams.operationId)
        .then((operation) => {
          this.domain = operation.domain;
          this.creationDate = operation.creationDate;
          this.doneDate = operation.doneDate;

          if (operation.status === 'done') {
            return { progress: 100 };
          }
          return this.Operation.getProgressBar(operation.id);
        })
        .then((progress) => {
          this.progress = progress;

          if (get(this.progress, 'currentStep.step', false)) {
            this.progress.currentStep.step = camelCase(
              this.progress.currentStep.step,
            );
            this.progress.followUpSteps = map(
              get(this.progress, 'followUpSteps', []),
              (step) => {
                const s = clone(step);
                s.step = camelCase(s.step);
                return s;
              },
            );
            set(
              find(
                this.steps,
                (step) => step.name === this.progress.currentStep.step,
              ),
              'active',
              true,
            );
            this.currentStepIndex = findIndex(this.progress.followUpSteps, {
              step: this.progress.currentStep.step,
            });
            this.timeleft = moment().isBefore(this.progress.expectedDoneDate)
              ? moment().to(this.progress.expectedDoneDate, true)
              : null;
          }
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domains_operations_error'),
            err,
            ALERTER_ID,
          ),
        )
        .finally(() => {
          this.loading = false;
        });
    }
  },
);
