import set from 'lodash/set';

angular
  .module('managerApp')
  .controller('PackXdslResiliationCtrl', function PackXdslResiliationCtrl(
    $scope,
    $stateParams,
    $translate,
    $q,
    $timeout,
    $filter,
    OvhApiXdsl,
    TucToastError,
    OvhApiXdslResiliation,
    TucToast,
  ) {
    const self = this;

    this.loading = true;

    this.dpOpts = {
      minDate: null,
    };

    this.init = function init() {
      self.serviceDetails = null;
      self.resiliationTerms = null;
      self.loading = true;
      self.when = null;
      self.followup = null;

      return OvhApiXdsl.v6()
        .get({ xdslId: $stateParams.serviceName })
        .$promise.then(
          (data) => {
            self.serviceDescription = $translate.instant(
              'xdsl_resiliation_cancel_really',
              {
                description: data.description || data.serviceName,
              },
            );
            return data;
          },
          (err) => new TucToastError(err),
        )
        .then(() =>
          OvhApiXdslResiliation.Aapi()
            .terms({
              serviceName: $stateParams.serviceName,
            })
            .$promise.then(
              (data) => {
                self.resiliationTerms = data;
                self.dpOpts.minDate = data.data.minResiliationDate
                  ? new Date(data.data.minResiliationDate)
                  : new Date();
                self.minResiliationDate = self.dpOpts.minDate;

                self.when = new Date(
                  self.resiliationTerms.data.resiliationDate,
                );
                self.whenStr = self.when;

                return OvhApiXdslResiliation.v6()
                  .followUp({
                    serviceName: $stateParams.serviceName,
                  })
                  .$promise.then((followUp) => {
                    set(
                      followUp,
                      'dateTodo',
                      $filter('date')(followUp.dateTodo, 'dd/MM/yyyy'),
                    );

                    self.resiliationTerms.onGoingResiliation = {
                      dateTodo: followUp.dateTodo,
                      needModemReturn: followUp.needModemReturn,
                    };
                    return self.resiliationTerms;
                  });
              },
              (err) => new TucToastError(err),
            )
            .finally(() => {
              self.loading = false;
            }),
        );
    };

    /**
     * Resiliate a service
     * @param  {Object} service Service to resiliate
     * @param  {Object} survey  Reason to resiliate
     * @param {Boolean} accept  If true the resiliation must be done
     */
    this.resiliateService = function resiliateService(service, survey, accept) {
      if (accept) {
        self.loading = true;
        return OvhApiXdslResiliation.v6()
          .resiliate(
            {
              serviceName: service.id,
            },
            {
              resiliationSurvey: survey,
              resiliationDate: self.when ? self.when.toISOString() : null,
            },
          )
          .$promise.then(
            () => {
              TucToast.success($translate.instant('xdsl_resiliation_mail'));
              self.init();
            },
            (err) => new TucToastError(err),
          )
          .finally(() => {
            self.loading = false;
          });
      }
      return $q.when(null);
    };

    /**
     * Compute the new price
     * @returns {*}
     */
    this.computePrice = function computePrice([selectedDate]) {
      self.when = selectedDate;
      self.computingPrice = true;
      return OvhApiXdslResiliation.v6()
        .resiliationTerms({
          serviceName: $stateParams.serviceName,
          resiliationDate: self.when ? self.when.toISOString() : null,
        })
        .$promise.then(
          (data) => {
            if (data.due) {
              self.resiliationTerms.data.due = data.due;
            }
          },
          (err) => new TucToastError(err),
        )
        .finally(() => {
          self.computingPrice = false;
        });
    };

    /**
     * Cancel an on-going resiliation
     * @param  {Object} service Service to cancel resiliation
     */
    this.cancelServiceResiliation = function cancelServiceResiliation(service) {
      self.loading = true;
      return OvhApiXdslResiliation.v6()
        .cancelResiliation(
          {
            serviceName: service.serviceName,
          },
          null,
        )
        .$promise.then(
          () => {
            self.init();
          },
          (err) => new TucToastError(err),
        )
        .finally(() => {
          self.loading = false;
        });
    };

    this.init();
  });
