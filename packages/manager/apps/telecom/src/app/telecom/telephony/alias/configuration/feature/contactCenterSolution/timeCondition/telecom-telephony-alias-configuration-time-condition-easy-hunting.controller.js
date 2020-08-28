import get from 'lodash/get';
import isNull from 'lodash/isNull';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasConfigurationTimeConditionCtrl',
  class TelecomTelephonyAliasConfigurationTimeConditionCtrl {
    constructor(
      $state,
      $stateParams,
      $translate,
      $uibModal,
      OvhApiTelephony,
      TelephonyMediator,
      TucToast,
      tucTelephonyBulk,
      uiCalendarConfig,
      VoipTimeConditionCondition,
      voipTimeConditionConfiguration,
      TUC_TELEPHONY_ALIAS_FEATURE_TYPES,
    ) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.OvhApiTelephony = OvhApiTelephony;
      this.TelephonyMediator = TelephonyMediator;
      this.TucToast = TucToast;
      this.tucTelephonyBulk = tucTelephonyBulk;
      this.uiCalendarConfig = uiCalendarConfig;
      this.VoipTimeConditionCondition = VoipTimeConditionCondition;
      this.voipTimeConditionConfiguration = voipTimeConditionConfiguration;
      this.TUC_TELEPHONY_ALIAS_FEATURE_TYPES = TUC_TELEPHONY_ALIAS_FEATURE_TYPES;
    }

    $onInit() {
      this.loading = true;
      this.timeConditionLabel = this.$translate
        .instant(
          'telephony_alias_config_contactCenterSolution_timeCondition_label',
        )
        .toLowerCase();

      // Bulk action initialization
      this.bulkActionNames = {
        createCondition: 'createSrcCondition',
        deleteCondition: 'deleteSrcCondition',
        editCondition: 'editSrcCondition',
        options: 'options',
      };

      this.bulkData = {
        conditions: get(this.number, 'feature.timeCondition', []),
        infos: {
          name: 'timeConditionEasyHunting',
          actions: [
            {
              name: this.bulkActionNames.deleteCondition,
              route:
                '/telephony/{billingAccount}/easyHunting/{serviceName}/timeConditions/conditions/{conditionId}',
              method: 'DELETE',
              params: null,
            },
            {
              name: this.bulkActionNames.createCondition,
              route:
                '/telephony/{billingAccount}/easyHunting/{serviceName}/timeConditions/conditions',
              method: 'POST',
              params: null,
            },
            {
              name: this.bulkActionNames.editCondition,
              route:
                '/telephony/{billingAccount}/easyHunting/{serviceName}/timeConditions/conditions/{conditionId}',
              method: 'PUT',
              params: null,
            },
            {
              name: this.bulkActionNames.options,
              route:
                '/telephony/{billingAccount}/easyHunting/{serviceName}/timeConditions',
              method: 'PUT',
              params: null,
            },
          ],
        },
      };
      // End of bulk action initialization

      return this.TelephonyMediator.getGroup(this.$stateParams.billingAccount)
        .then((group) => {
          this.number = group.getNumber(this.$stateParams.serviceName);
          return this.number.feature.init();
        })
        .then(() => this.number.feature.getTimeCondition())
        .then(() => {
          this.number.feature.timeCondition.startEdition();
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_configuration_time_condition_load_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    exportConfiguration() {
      if (this.number.feature.timeCondition.conditions) {
        this.voipTimeConditionConfiguration.exportConfiguration(
          this.number.feature.timeCondition.conditions,
        );
      }
    }

    importConfiguration() {
      this.$uibModal
        .open({
          animation: true,
          templateUrl:
            'app/telecom/telephony/service/time-condition/import/telecom-telephony-service-time-condition-import.html',
          controller: 'TelecomTelephonyServiceTimeConditionImportCtrl',
          controllerAs: 'TimeConditionImportCtrl',
        })
        .result.then((conditionsToImport) => {
          // Set existing condition state to delete
          this.number.feature.timeCondition.conditions = this.number.feature.timeCondition.conditions.map(
            (condition) => {
              const conditionToDelete = condition;
              conditionToDelete.state = 'TO_DELETE';
              return conditionToDelete;
            },
          );

          return this.number.feature.timeCondition.saveConditions().then(() => {
            this.number.feature.timeCondition.conditions = this.number.feature.timeCondition.conditions.concat(
              conditionsToImport.map((condition) => {
                const conditionToCreate = condition;
                conditionToCreate.billingAccount = this.$stateParams.billingAccount;
                conditionToCreate.serviceName = this.$stateParams.serviceName;
                conditionToCreate.state = 'TO_CREATE';
                conditionToCreate.featureType = 'easyHunting';

                return new this.VoipTimeConditionCondition(conditionToCreate);
              }),
            );

            this.uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
              'refetchEvents',
            );
            return this.number.feature.timeCondition.saveConditions();
          });
        })
        .then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_common_time_condition_import_configuration_success',
            ),
          );
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_common_time_condition_import_configuration_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.$onInit();
        });
    }

    hasChanged() {
      const isConditionsInEdition = this.number.feature.timeCondition.conditions.some(
        ({ inEdition }) => inEdition,
      );
      return (
        !isConditionsInEdition && this.number.feature.timeCondition.hasChange()
      );
    }

    updateContactCenterSolution() {
      this.loading = true;

      // first save options
      return this.number.feature.timeCondition
        .save()
        .then(() => {
          this.number.feature.timeCondition
            .stopEdition()
            .stopSlotsEdition(false, false, true)
            .startEdition();

          // then save conditions
          return this.number.feature.timeCondition.saveConditions();
        })
        .then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_timeCondition_update_success',
            ),
          );
        })
        .catch((error) => {
          this.number.feature.timeCondition.stopEdition(true).startEdition();
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_timeCondition_update_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    onTimeConditionFormReset() {
      this.number.feature.timeCondition
        .stopEdition(true)
        .stopSlotsEdition(true, true)
        .stopConditionsEdition(true, true)
        .startEdition();

      this.uiCalendarConfig.calendars.conditionsCalendar.fullCalendar(
        'refetchEvents',
      );
    }

    manageScheduler() {
      this.onTimeConditionFormReset();
      this.$state.go(
        'telecom.telephony.billingAccount.alias.details.configuration.timeCondition.scheduler',
      );
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
      return (action) => {
        switch (action) {
          case this.bulkActionNames.createCondition:
          case this.bulkActionNames.deleteCondition:
          case this.bulkActionNames.editCondition:
            return this.getTimeConditions(action);
          case this.bulkActionNames.options:
            return {
              slot1Number: this.number.feature.timeCondition.slots[1].number,
              slot1Type: !isNull(
                this.number.feature.timeCondition.slots[1].number,
              )
                ? this.number.feature.timeCondition.slots[1].type
                : '',
              slot2Number: this.number.feature.timeCondition.slots[2].number,
              slot2Type: !isNull(
                this.number.feature.timeCondition.slots[2].number,
              )
                ? this.number.feature.timeCondition.slots[2].type
                : '',
              slot3Number: this.number.feature.timeCondition.slots[3].number,
              slot3Type: !isNull(
                this.number.feature.timeCondition.slots[3].number,
              )
                ? this.number.feature.timeCondition.slots[3].type
                : '',
              enable: this.number.feature.timeCondition.enable,
              unavailableNumber: this.number.feature.timeCondition.slots[4]
                .number,
              unavailableType: !isNull(
                this.number.feature.timeCondition.slots[4].number,
              )
                ? this.number.feature.timeCondition.slots[4].type
                : '',
            };
          default:
            return false;
        }
      };
    }

    getTimeConditions(action) {
      return this.number.feature.timeCondition.conditions
        .filter((condition) => {
          switch (action) {
            case this.bulkActionNames.createCondition:
              return condition.state === 'TO_CREATE';
            case this.bulkActionNames.deleteCondition:
              return condition.state === 'TO_DELETE';
            case this.bulkActionNames.editCondition:
              return condition.state === 'TO_EDIT';
            default:
              return null;
          }
        })
        .map((condition) => ({
          conditionId: condition.conditionId,
          weekDay: condition.weekDay,
          timeFrom: condition.timeFrom,
          timeTo: condition.timeTo,
          policy: condition.policy,
          status: condition.status,
        }));
    }

    onBulkSuccess() {
      return (bulkResult) => {
        // display message of success or error
        this.tucTelephonyBulk
          .getTucToastInfos(bulkResult, {
            fullSuccess: this.$translate.instant(
              'telephony_line_calls_time_condition_bulk_all_success',
            ),
            partialSuccess: this.$translate.instant(
              'telephony_line_calls_time_condition_bulk_some_success',
              {
                count: bulkResult.success.length,
              },
            ),
            error: this.$translate.instant(
              'telephony_line_calls_time_condition_bulk_error',
            ),
          })
          .forEach(({ message, type }) => {
            this.TucToast[type](message, {
              hideAfter: null,
            });
          });

        this.number.feature.timeCondition
          .stopEdition()
          .stopSlotsEdition(false, false, true)
          .stopConditionsEdition(true, true)
          .startEdition();

        this.OvhApiTelephony.TimeCondition().resetCache();
        this.TelephonyMediator.resetAllCache();
      };
    }

    onBulkError() {
      return (error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_line_calls_time_condition_bulk_on_error',
          )}, ${get(error, 'msg.data', '')}`,
        );
      };
    }
  },
);
