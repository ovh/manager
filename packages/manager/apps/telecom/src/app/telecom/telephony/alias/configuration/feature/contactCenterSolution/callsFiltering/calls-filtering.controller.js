import get from 'lodash/get';
import isObject from 'lodash/isObject';
import startsWith from 'lodash/startsWith';

import deleteTemplate from './delete/delete.html';
import deleteController from './delete/delete.controller';

import { FILTERING } from '../contact-center-solution.constants';

export default class TelecomTelephonyAliasConfigurationCallsFilteringCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $state,
    $stateParams,
    $translate,
    $uibModal,
    tucTelephonyBulk,
    TucToast,
    tucVoipServiceAlias,
    TUC_TELEPHONY_ALIAS_FEATURE_TYPES,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.tucTelephonyBulk = tucTelephonyBulk;
    this.TucToast = TucToast;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.TUC_TELEPHONY_ALIAS_FEATURE_TYPES = TUC_TELEPHONY_ALIAS_FEATURE_TYPES;
  }

  $onInit() {
    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };

    this.listTypes = FILTERING.listTypes
      .filter((type) => startsWith(type, 'incoming'))
      .map((type) => ({
        id: type,
        label: this.$translate.instant(
          `telephony_alias_configuration_calls_filtering_type_${type}`,
        ),
      }));

    this.helpers = FILTERING.helperPrefixes.map(({ label }) => ({
      id: label,
      label: this.$translate.instant(
        `telephony_alias_configuration_calls_filtering_helper_${label}`,
      ),
    }));
    this.helpers.unshift({
      id: null,
      label: this.$translate.instant('common_none'),
    });

    [this.listType] = this.listTypes;
    [this.helper] = this.helpers;

    this.defineBulkData();

    this.loading = true;
    return this.$q
      .all({
        ccsNumber: this.tucVoipServiceAlias.fetchContactCenterSolutionNumber(
          this.serviceInfos,
        ),
        screenLists: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberScreenListsConditions(
          this.serviceInfos,
        ),
        screenListsStatus: this.fetchScreenListsStatus(),
      })
      .then(({ ccsNumber, screenLists, screenListsStatus }) => {
        this.number = angular.copy(ccsNumber);
        this.copyNumber = angular.copy(ccsNumber);
        this.screenLists = this.formatScreenLists(screenLists);
        this.screenListsStatus = screenListsStatus.status;
        this.copyScreenListsStatus = angular.copy(screenListsStatus.status);
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_calls_filtering_get_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchScreenListsStatus() {
    return this.tucVoipServiceAlias.fetchContactCenterSolutionNumberScreenListsStatus(
      this.serviceInfos,
    );
  }

  addScreenList(screen) {
    const screenToAdd = screen;
    screenToAdd.type = screen.type.replace(/outgoing/, 'destination');

    return this.tucVoipServiceAlias.addContactCenterSolutionNumberScreenListCondition(
      screenToAdd,
    );
  }

  deleteCondition(conditionToRemove) {
    this.deleting = true;
    return this.deleteScreenListCondition(conditionToRemove)
      .then(() =>
        this.tucVoipServiceAlias.fetchContactCenterSolutionNumberScreenListsConditions(
          this.serviceInfos,
        ),
      )
      .then((screenLists) => {
        this.screenLists = this.formatScreenLists(screenLists);
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_calls_filtering_delete_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.deleting = false;
      });
  }

  deleteScreenListCondition(conditionToRemove) {
    return this.tucVoipServiceAlias.removeContactCenterSolutionNumberScreenListConditions(
      this.serviceInfos,
      conditionToRemove,
    );
  }

  canAddConditions() {
    return this.numberToAdd || this.helper.id;
  }

  canUpdateAnonymousRejection() {
    return !angular.equals(this.number, this.copyNumber);
  }

  canUpdateFilteringStatus() {
    return !angular.equals(this.screenListsStatus, this.copyScreenListsStatus);
  }

  canUpdateSettings() {
    return (
      this.canAddConditions() ||
      this.canUpdateAnonymousRejection() ||
      this.canUpdateFilteringStatus()
    );
  }

  addConditions() {
    let conditions = [];
    if (this.numberToAdd) {
      conditions.push(this.numberToAdd);
    }

    if (this.helper.id) {
      const { prefixes } = FILTERING.helperPrefixes.find(
        ({ label }) => label === this.helper.id,
      );
      conditions = conditions.concat(prefixes);
    }

    return conditions.map((condition) =>
      this.tucVoipServiceAlias.addContactCenterSolutionNumberScreenListCondition(
        this.serviceInfos,
        {
          callNumber: condition,
          type: this.listType.id,
        },
      ),
    );
  }

  updateScreenListConditionsConfiguration() {
    this.loading = true;

    return this.$q
      .all({
        addConditions: this.canAddConditions()
          ? this.addConditions()
          : this.$q.when(),
        updateAnonymousRejections: this.canUpdateAnonymousRejection()
          ? this.tucVoipServiceAlias.updateContactCenterSolutionNumber(
              this.serviceInfos,
              this.number,
            )
          : this.$q.when(),
        updateScreenListFiltering: this.tucVoipServiceAlias.updateContactCenterSolutionNumberScreenListConditions(
          this.serviceInfos,
          this.screenListsStatus,
        ),
      })
      .then(() =>
        this.$state.go('^').then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_configuration_calls_filtering_add_success',
            ),
          );
        }),
      )
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_calls_filtering_add_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getScreenListNature(callNumber) {
    const formatedNumber = this.$filter('tucPhoneNumber')(callNumber).replace(
      ' ',
      '',
    );
    const detectedPrefix = FILTERING.helperPrefixes.find(({ prefixes }) =>
      prefixes.find((prefix) => startsWith(formatedNumber, prefix)),
    );

    return detectedPrefix ? detectedPrefix.label : 'line';
  }

  formatScreenLists(screenLists) {
    return screenLists.map((filter) => ({
      id: filter.conditionId,
      callNumber: filter.callerIdNumber,
      nature: this.getScreenListNature(filter.callerIdNumber),
      status: 'enabled',
      type: filter.screenListType,
      shortType: startsWith(filter.screenListType, 'incoming')
        ? 'incoming'
        : 'outgoing',
      list: filter.screenListType.includes('White') ? 'white' : 'black',
    }));
  }

  deleteConditions(conditions) {
    this.$uibModal
      .open({
        template: deleteTemplate,
        controller: deleteController,
        controllerAs: '$ctrl',
        resolve: {
          itemCount: conditions.length,
        },
      })
      .result.then(() =>
        this.$q.all(
          conditions.map((condition) =>
            this.deleteScreenListCondition(condition),
          ),
        ),
      )
      .then(() => {
        this.$onInit();
      })
      .catch((error) => {
        if (isObject(error)) {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_configuration_calls_filtering_delete_all_error',
            )} ${get(error, 'data.message', '')}`,
          );
        }
      });
  }

  defineBulkData() {
    this.bulkData = {
      billingAccount: this.serviceInfos.billingAccount,
      serviceName: this.serviceInfos.serviceName,
      infos: {
        name: 'screenListConditions',
        actions: [
          {
            name: 'screenListConditions',
            route:
              '/telephony/{billingAccount}/easyHunting/{serviceName}/screenListConditions',
            method: 'PUT',
            params: null,
          },
        ],
      },
    };
  }

  filterServices() {
    return (services) =>
      services.filter(({ featureType }) =>
        this.TUC_TELEPHONY_ALIAS_FEATURE_TYPES.contactCenterSolution.includes(
          featureType,
        ),
      );
  }

  getBulkParams() {
    return () => ({
      status: this.setFiltering ? this.listType.id : 'disabled',
    });
  }

  onBulkSuccess() {
    return (bulkResult) => {
      this.tucTelephonyBulk
        .getTucToastInfos(bulkResult, {
          fullSuccess: this.$translate.instant(
            'telephony_line_calls_filtering_bulk_all_success',
          ),
          partialSuccess: this.$translate.instant(
            'telephony_line_calls_filtering_bulk_some_success',
            {
              count: bulkResult.success.length,
            },
          ),
          error: this.$translate.instant(
            'telephony_line_calls_filtering_bulk_error',
          ),
        })
        .forEach((toastInfo) => {
          this.TucToast[toastInfo.type](toastInfo.message, {
            hideAfter: null,
          });
        });

      this.OvhApiTelephony.EasyHunting()
        .ScreenListConditions()
        .resetCache();
      this.$onInit();
    };
  }

  onBulkError() {
    return (error) => {
      this.TucToast.error(
        `${this.$translate.instant(
          'telephony_line_calls_filtering_bulk_on_error',
        )} ${get(error, 'msg.data', error.message)}`,
      );
    };
  }

  static exportSelection(selectedScreenLists) {
    return selectedScreenLists.map(({ callNumber, nature, type }) => ({
      callNumber,
      nature,
      type,
    }));
  }
}
