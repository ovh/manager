import _ from 'lodash';
import angular from 'angular';
import moment from 'moment';

import addCtrl from './add/telecom-telephony-service-fax-campaigns-add.controller';
import addTpl from './add/telecom-telephony-service-fax-campaigns-add.html';
import readCtrl from './read/telecom-telephony-service-fax-campaigns-read.controller';
import readTpl from './read/telecom-telephony-service-fax-campaigns-read.html';
import './read/telecom-telephony-service-fax-campaigns-read.less';
import removeCtrl from './remove/telecom-telephony-service-fax-campaigns-remove.controller';
import removeTpl from './remove/telecom-telephony-service-fax-campaigns-remove.html';

export default /* @ngInject */ function ($q, $stateParams, $translate, $filter, $uibModal,
  OvhApiTelephony, TucToast, TucToastError, tucValidator) {
  const self = this;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  function fetchCampaigns() {
    return OvhApiTelephony.Fax().Campaigns().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(campaignsIds => $q
        .all(_.map(
          campaignsIds,
          id => OvhApiTelephony.Fax().Campaigns().v6().get({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id,
          }).$promise,
        ))
        .then(campaigns => _.each(campaigns, (campaign) => {
          _.set(campaign, 'reference', campaign.reference.slice(1, -1));
          if (tucValidator.isDate(campaign.reference) && (campaign.status === 'error' || campaign.status === 'todo')) {
            _.set(campaign, 'reference', moment(campaign.reference).format());
          }
        })));
  }

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.applySorting = function applySorting() {
    let data = angular.copy(self.campaigns.raw);
    data = $filter('filter')(data, self.campaigns.filterBy, true);
    data = $filter('orderBy')(
      data,
      self.campaigns.orderBy,
      self.campaigns.orderDesc,
    );
    self.campaigns.sorted = data;
  };

  self.toggleShowFilter = function toggleShowFilter() {
    self.campaigns.showFilter = !self.campaigns.showFilter;
    self.campaigns.filterBy = {
      status: undefined,
    };
    self.applySorting();
  };

  self.orderBy = function orderBy(by) {
    if (self.campaigns.orderBy === by) {
      self.campaigns.orderDesc = !self.campaigns.orderDesc;
    } else {
      self.campaigns.orderBy = by;
    }
    self.applySorting();
  };

  self.refresh = function refresh() {
    self.campaigns.isLoading = true;
    OvhApiTelephony.Fax().Campaigns().v6().resetQueryCache();
    OvhApiTelephony.Fax().Campaigns().v6().resetCache();
    return fetchCampaigns().then((campaigns) => {
      self.campaigns.raw = campaigns;
      self.applySorting();
    }).catch(err => new TucToastError(err)).finally(() => {
      self.campaigns.isLoading = false;
    });
  };

  self.addCampaign = function addCampaign() {
    const modal = $uibModal.open({
      animation: true,
      templateUrl: addTpl,
      controller: addCtrl,
      controllerAs: 'CampaignsAddCtrl',
    });

    modal.result.then(() => {
      self.refresh();
    }, (error) => {
      if (error && error.type === 'API') {
        TucToast.error($translate.instant('telephony_service_fax_campaigns_add_campaign_ko', { error: error.message }));
      }
    });

    return modal;
  };

  self.readCampaign = function readCampaign($event, campaign) {
    $event.preventDefault();

    if (campaign.status === 'stop') {
      return null;
    }

    const modal = $uibModal.open({
      animation: true,
      templateUrl: readTpl,
      controller: readCtrl,
      controllerAs: 'CampaignsReadCtrl',
      resolve: {
        campaign() { return campaign; },
      },
    });

    return modal;
  };

  self.startCampaign = function startCampaign($event, campaign) {
    $event.preventDefault();

    if (campaign.status === 'todo' || campaign.status === 'doing' || campaign.status === 'stop') {
      return $q.when(null);
    }

    return OvhApiTelephony.Fax().Campaigns().v6().start({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
      id: campaign.id,
    }, {}).$promise.then(() => {
      self.refresh();
      TucToast.success($translate.instant('telephony_service_fax_campaigns_start_ok'));
    }, (error) => {
      TucToast.error($translate.instant('telephony_service_fax_campaigns_start_ko', { error: _.get(error, 'data.message') }));
      return $q.reject(error);
    });
  };

  self.stopCampaign = function stopCampaign($event, campaign) {
    $event.preventDefault();

    if (campaign.status === 'stopTodo' || campaign.status === 'stopDoing') {
      return $q.when(null);
    }

    return OvhApiTelephony.Fax().Campaigns().v6().stop({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
      id: campaign.id,
    }, {}).$promise.then(() => {
      self.refresh();
      TucToast.success($translate.instant('telephony_service_fax_campaigns_stop_ok'));
    }, (error) => {
      TucToast.error($translate.instant('telephony_service_fax_campaigns_stop_ko', { error: _.get(error, 'data.message') }));
      return $q.reject(error);
    });
  };

  self.removeCampaign = function removeCampaign($event, campaign) {
    $event.preventDefault();

    const modal = $uibModal.open({
      animation: true,
      templateUrl: removeTpl,
      controller: removeCtrl,
      controllerAs: 'CampaignsRemoveCtrl',
      resolve: {
        campaign() { return campaign; },
      },
    });

    modal.result.then(() => {
      self.refresh();
    }, (error) => {
      if (error && error.type === 'API') {
        TucToast.error($translate.instant('telephony_service_fax_campaigns_removing_ko', { error: error.message }));
      }
    });

    return modal;
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.campaigns = {
      raw: [],
      paginated: null,
      sorted: null,
      orderBy: 'name',
      orderDesc: false,
      filterBy: {
        status: undefined,
      },
      showFilter: false,
      isLoading: false,
    };

    self.campaigns.isLoading = true;
    return fetchCampaigns().then((campaigns) => {
      self.campaigns.raw = angular.copy(campaigns);
      self.applySorting();
    }).catch(err => new TucToastError(err)).finally(() => {
      self.campaigns.isLoading = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
