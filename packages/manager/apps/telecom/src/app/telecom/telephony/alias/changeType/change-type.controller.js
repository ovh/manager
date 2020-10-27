import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import confirmController from './confirm/confirm.controller';
import confirmTemplate from './confirm/confirm.html';

export default class TelecomTelephonyAliasChangeTypeCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    $uibModal,
    atInternet,
    OvhApiTelephony,
    TucToast,
    tucTelephonyBulk,
    tucVoipService,
    tucVoipServiceAlias,
    tucVoipServiceTask,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiTelephony = OvhApiTelephony;
    this.tucTelephonyBulk = tucTelephonyBulk;
    this.TucToast = TucToast;
    this.tucVoipService = tucVoipService;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.tucVoipServiceTask = tucVoipServiceTask;
  }

  $onInit() {
    this.number = null;
    this.loading = true;

    this.billingAccount = this.$stateParams.billingAccount;
    this.serviceName = this.$stateParams.serviceName;

    this.options = {
      simpleMode: [
        'cloudIvr',
        'conference',
        'contactCenterSolution',
        'redirect',
      ],
      expertMode: ['contactCenterSolutionExpert', 'svi'],
    };

    this.bulkData = {
      infos: {
        name: 'configurationNumberChangeType',
        actions: [
          {
            name: 'options',
            route:
              '/telephony/{billingAccount}/number/{serviceName}/changeFeatureType',
            method: 'POST',
            params: null,
          },
        ],
      },
    };

    this.tucVoipService
      .fetchSingleService(this.billingAccount, this.serviceName)
      .then((number) => {
        this.number = number;
        this.initSelectedFeatureType();

        return this.number;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant('telephony_alias_load_error')} ${get(
            error,
            'data.message',
            '',
          )}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  initSelectedFeatureType() {
    this.selectedFeatureType = {
      id: this.number.featureType,
      name: this.$translate.instant(
        `telephony_alias_config_change_type_desc_${this.number.featureType}`,
      ),
    };
  }

  canChangeType() {
    if (this.showExpertOptions) {
      return (
        this.options.expertMode.includes(this.selectedFeatureType.id) &&
        this.selectedFeatureType.id !== this.number.featureType
      );
    }

    return (
      this.options.simpleMode.includes(this.selectedFeatureType.id) &&
      this.selectedFeatureType.id !== this.number.featureType
    );
  }

  confirmChoice() {
    if (!isEqual(this.number.featureType, 'empty')) {
      const validChoiceModal = this.$uibModal.open({
        template: confirmTemplate,
        controller: confirmController,
        controllerAs: '$ctrl',
        resolve: {
          currentFeatureType: () =>
            this.$translate.instant(
              `telephony_alias_configuration_configuration_type_${this.number.featureType}`,
            ),
        },
      });

      validChoiceModal.result.then(() => {
        this.changeType();
      });
    } else {
      this.changeType();
    }
  }

  changeType() {
    this.loading = true;

    this.tucVoipServiceAlias
      .changeNumberFeatureType(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        },
        this.selectedFeatureType.id,
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant('telephony_alias_change_type_ok'),
        );
        this.OvhApiTelephony.Service()
          .v6()
          .resetCache();
        this.$state.go('^').then(() => {
          this.$state.reload();
        });
      })
      .catch((error) => {
        if (!isEqual(error.type, 'poller')) {
          this.TucToast.error(
            `${this.$translate.instant('telephony_alias_change_type_ko')} ${get(
              error,
              'data.message',
              '',
            )}`,
          );
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkServerTasksStatus() {
    const { tucVoipServiceTask } = this;
    return (updatedServices) => {
      function runPollOnTask(billingAccount, serviceName, taskId) {
        return () =>
          tucVoipServiceTask.startPolling(billingAccount, serviceName, taskId);
      }

      this.loading = true;
      let chain = this.$q.when();

      updatedServices.forEach(({ billingAccount, serviceName, values }) => {
        const [id] = values
          .map(({ value }) => value)
          .filter(({ action }) => action === 'changeType')
          .map((value) => value.taskId);

        // chaining each promises
        chain = chain
          .then(runPollOnTask(billingAccount, serviceName, id))
          .then((result) => {
            if (result) {
              this.successfulTasks.push(result);
            }
          });
      });

      return chain;
    };
  }

  switchOptionMode() {
    this.showExpertOptions = !this.showExpertOptions;
    this.initSelectedFeatureType();

    this.atInternet.trackClick({
      name: `telecom::telephony::alias::configuration::change_type::${
        this.showExpertOptions ? 'show_expert_options' : 'show_simple_options'
      }`,
      type: 'action',
    });
  }

  /* ===========================
  =            BULK            =
  ============================ */

  canApplyBulkAction() {
    const allOptions = [...this.options.simpleMode, ...this.options.expertMode];
    return allOptions.includes(this.selectedFeatureType.id);
  }

  getBulkParams() {
    return () => ({ featureType: this.selectedFeatureType.id });
  }

  onBulkSuccess() {
    const checkServerTasksStatus = this.checkServerTasksStatus();
    this.successfulTasks = [];
    return (bulkResult) => {
      // check if server tasks are all successful
      checkServerTasksStatus(bulkResult.success)
        .then(() => {
          // if one of the promises fails, the failed result won't be stored in successfulTasks
          if (this.successfulTasks.length < bulkResult.success.length) {
            this.TucToast.warn([
              this.$translate.instant(
                'telephony_alias_config_change_type_bulk_server_tasks_some_error',
              ),
            ]);
          }

          this.tucTelephonyBulk
            .getTucToastInfos(bulkResult, {
              fullSuccess: this.$translate.instant(
                'telephony_alias_config_change_type_bulk_all_success',
              ),
              partialSuccess: this.$translate.instant(
                'telephony_alias_config_change_type_bulk_some_success',
                {
                  count: bulkResult.success.length,
                },
              ),
              error: this.$translate.instant(
                'telephony_alias_config_change_type_bulk_error',
              ),
            })
            .forEach(({ message, type }) => {
              this.TucToast[type](message, {
                hideAfter: null,
              });
            });

          this.OvhApiTelephony.Service()
            .v6()
            .resetCache();
          this.OvhApiTelephony.Service()
            .v6()
            .resetQueryCache();

          this.$state
            .go('telecom.telephony.billingAccount.alias.configuration')
            .then(() => {
              this.$state.reload();
            });
        })
        .catch(() => {
          this.TucToast.error([
            this.$translate.instant(
              'telephony_alias_config_change_type_bulk_server_tasks_all_error',
            ),
          ]);
        })
        .finally(() => {
          this.loading = false;
        });
    };
  }

  onBulkError() {
    return (error) => {
      this.TucToast.error(
        `${this.$translate.instant(
          'telephony_alias_config_change_type_bulk_on_error',
        )} ${get(error, 'msg.data', '')}`,
      );
    };
  }

  /* -----  End of BULK  ------ */
}
