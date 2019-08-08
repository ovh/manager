angular.module('App').controller(
  'DomainOperationProgressCtrl',
  class DomainOperationProgressCtrl {
    constructor($scope, $stateParams, $translate, Alerter, domainOperationService) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Operation = domainOperationService;
    }

    $onInit() {
      this.$scope.alerts = { dashboard: 'domains.operations.alerts' };
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
      return this.Operation.getOperation(this.$stateParams.operationId)
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

          if (_.get(this.progress, 'currentStep.step', false)) {
            this.progress.currentStep.step = _.camelCase(this.progress.currentStep.step);
            this.progress.followUpSteps = _.map(
              _.get(this.progress, 'followUpSteps', []),
              (step) => {
                const s = _(step).clone();
                s.step = _.camelCase(s.step);
                return s;
              },
            );
            _.set(
              _.find(
                this.steps,
                step => step.name === this.progress.currentStep.step,
              ),
              'active',
              true,
            );
            this.currentStepIndex = _.findIndex(this.progress.followUpSteps, {
              step: this.progress.currentStep.step,
            });
            this.timeleft = moment().isBefore(this.progress.expectedDoneDate)
              ? moment().to(this.progress.expectedDoneDate, true)
              : null;
          }
        })
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('domains_operations_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => {
          this.loading = false;
        });
    }
  },
);
