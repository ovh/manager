import find from 'lodash/find';
import map from 'lodash/map';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingHistoryDetailsCtrl',
    function CloudProjectBillingHistoryDetailsCtrl(
      $q,
      $translate,
      $stateParams,
      validParams,
      CucCloudMessage,
      CloudProjectBillingService,
      OvhApiCloudProjectUsageHistory,
      OvhApiCloudProjectUsageCurrent,
    ) {
      const self = this;
      self.year = null;
      self.month = null;
      self.data = {};
      self.monthBilling = null;
      self.billingUrl = buildURL('dedicated', '#/billing/history');

      self.getHourlyBillingDateInfo = function getHourlyBillingDateInfo() {
        const prev = moment(self.monthBilling).subtract(1, 'month');
        return {
          month: prev.format('MMMM'),
          year: prev.year(),
        };
      };

      self.getBillingDateInfo = function getBillingDateInfo() {
        return {
          month: self.monthBilling.format('MMMM'),
          year: self.monthBilling.year(),
        };
      };

      function getConsumptionDetails(periods) {
        const detailPromises = map(
          periods,
          (period) =>
            OvhApiCloudProjectUsageHistory.v6().get({
              serviceName: $stateParams.projectId,
              usageId: period.id,
            }).$promise,
        );

        return $q
          .all(detailPromises)
          .then((periodDetails) => {
            let monthlyDetails;

            if (moment.utc().isSame(self.monthBilling, 'month')) {
              monthlyDetails = OvhApiCloudProjectUsageCurrent.v6().get({
                serviceName: $stateParams.projectId,
              }).$promise;
            } else {
              monthlyDetails = find(periodDetails, (detail) =>
                moment
                  .utc(detail.period.from)
                  .isSame(self.monthBilling, 'month'),
              );
            }

            const hourlyDetails = find(periodDetails, (detail) =>
              moment
                .utc(detail.period.from)
                .isSame(self.previousMonth, 'month'),
            );

            return {
              hourly: hourlyDetails,
              monthly: monthlyDetails,
            };
          })
          .then((details) =>
            $q
              .all(details)
              .then((allDetails) =>
                CloudProjectBillingService.getConsumptionDetails(
                  allDetails.hourly,
                  allDetails.monthly,
                ),
              ),
          );
      }

      function initConsumptionHistory() {
        return OvhApiCloudProjectUsageHistory.v6()
          .query({
            serviceName: $stateParams.projectId,
            from: self.previousMonth.format(),
            to: self.monthBilling.format(),
          })
          .$promise.then((historyPeriods) =>
            getConsumptionDetails(historyPeriods),
          )
          .then((details) => {
            self.data = details;
          });
      }

      function init() {
        self.loading = true;

        self.year = validParams.year;
        self.month = validParams.month;

        self.monthBilling = moment.utc({
          y: validParams.year,
          M: validParams.month - 1,
          d: 1,
        });
        self.previousMonth = moment.utc(self.monthBilling).subtract(1, 'month');

        initConsumptionHistory()
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpb_error_message'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return $q.reject(err);
          })
          .finally(() => {
            self.loading = false;
          });
      }

      init();
    },
  );
