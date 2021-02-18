import mapValues from 'lodash/mapValues';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

angular
  .module('managerApp')
  .controller('CloudProjectDeleteCtrl', function CloudProjectDeleteCtrl(
    $scope,
    $uibModalInstance,
    $translate,
    CucCloudMessage,
    $stateParams,
    $q,
    OvhApiCloudProjectInstance,
    OvhApiCloudProjectVolume,
    OvhApiCloudProjectSnapshot,
    $state,
    OvhApiCloudProjectStorage,
    OvhApiCloudProjectIpFailover,
    OvhApiCloudProjectIpV6,
    OvhApiCloudProject,
    OvhApiCloudProjectUsageCurrent,
    OvhApiCloudProjectCredit,
    CloudProjectBillingService,
    coreConfig,
  ) {
    const self = this;
    const { projectId } = $stateParams;
    const now = moment();

    self.resources = {
      instance: 0,
      volume: 0,
      snapshot: 0,
      storage: 0,
      ipFailoverOvh: 0,
      ipFailoverCloud: 0,
    };

    self.bill = undefined;
    self.hasCredits = false;

    self.error = false;

    self.loaders = {
      init: false,
      deleting: false,
    };

    function getConsumption() {
      return OvhApiCloudProjectUsageCurrent.v6()
        .get({
          serviceName: projectId,
        })
        .$promise.then((response) =>
          CloudProjectBillingService.getConsumptionDetails(response, response),
        )
        .then((data) => {
          self.bill = `${data.totals.hourly.total.toFixed(2)} ${
            data.totals.currencySymbol
          }`;
        })
        .catch((err) => $q.reject(err));
    }

    function getCredits() {
      function isNotExpired(credit) {
        const { validity } = credit;
        return (
          (!validity.from || now.isAfter(validity.from)) &&
          (!validity.to || now.isBefore(validity.to))
        );
      }

      return OvhApiCloudProjectCredit.Aapi()
        .query({
          serviceName: projectId,
        })
        .$promise.then((credits) => {
          self.hasCredits = credits.some(
            (credit) =>
              isNotExpired(credit) && credit.available_credit.value > 0,
          );
        });
    }

    function initRemainingResources() {
      return $q
        .all({
          instance: OvhApiCloudProjectInstance.v6().query({
            serviceName: projectId,
          }).$promise,
          volume: OvhApiCloudProjectVolume.v6().query({
            serviceName: projectId,
          }).$promise,
          snapshot: OvhApiCloudProjectSnapshot.v6().query({
            serviceName: projectId,
          }).$promise,
          storage: OvhApiCloudProjectStorage.v6().query({ projectId }).$promise,
          ipFailoverOvh: OvhApiCloudProjectIpFailover.v6().query({
            serviceName: projectId,
          }).$promise,
          ipFailoverCloud: OvhApiCloudProjectIpV6.query({
            serviceName: projectId,
          }).$promise,
        })
        .then((result) => {
          self.resources = mapValues(result, (arr) => arr.length);
        });
    }

    this.init = function init() {
      this.supportUrl = buildURL('dedicated', '#/support');

      if (coreConfig.getRegion() !== 'US') {
        self.loaders.init = true;
        $q.all([getConsumption(), getCredits(), initRemainingResources()])
          .then(
            () => {
              self.error = false;
            },
            () => {
              self.error = true;
            },
          )
          .finally(() => {
            self.loaders.init = false;
          });
      }
    };

    // ---------MODAL---------

    function deleteProject() {
      self.loaders.deleting = true;
      return OvhApiCloudProject.v6()
        .delete(
          {
            serviceName: projectId,
          },
          {},
        )
        .$promise.then(
          () => {
            self.errors = false;
          },
          (err) => {
            self.errors = true;
            return $q.reject(err);
          },
        )
        .finally(() => {
          self.loaders.deleting = false;
        });
    }

    self.confirm = function confirm() {
      return deleteProject().then(
        () => {
          CucCloudMessage.success(
            $translate.instant('cloud_project_delete_email_sent'),
          );
          $uibModalInstance.close();
        },
        () => {
          CucCloudMessage.error(
            $translate.instant('cloud_project_delete_error'),
          );
        },
      );
    };

    self.cancel = $uibModalInstance.dismiss;

    self.resetCache = function resetCache() {
      OvhApiCloudProjectInstance.v6().resetQueryCache();
      OvhApiCloudProjectVolume.v6().resetQueryCache();
      OvhApiCloudProjectSnapshot.v6().resetQueryCache();
      OvhApiCloudProjectIpFailover.v6().resetQueryCache();
      OvhApiCloudProjectIpV6.resetQueryCache();
      self.init();
    };

    self.init();
  });
