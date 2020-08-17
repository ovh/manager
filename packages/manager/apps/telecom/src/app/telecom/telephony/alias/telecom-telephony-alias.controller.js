import get from 'lodash/get';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasCtrl',
  class TelecomTelephonyAliasCtrl {
    constructor(
      $q,
      $state,
      $stateParams,
      $translate,
      SidebarMenu,
      serviceName,
      TelephonyMediator,
      TucToast,
      tucVoipService,
      tucVoipServiceAlias,
      TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES,
    ) {
      this.$q = $q;
      this.$state = $state;
      this.$translate = $translate;
      this.SidebarMenu = SidebarMenu;
      this.TelephonyMediator = TelephonyMediator;
      this.TucToast = TucToast;
      this.tucVoipService = tucVoipService;
      this.tucVoipServiceAlias = tucVoipServiceAlias;
      this.TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES = TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES;

      this.billingAccount = $stateParams.billingAccount;
      this.serviceName = serviceName !== 'default' ? serviceName : null;
    }

    $onInit() {
      this.alias = null;
      this.links = null;
      this.terminationTask = null;

      this.fetchService();
    }

    fetchService() {
      this.loading = true;
      this.tucVoipService
        .fetchSingleService(this.billingAccount, this.serviceName)
        .then((alias) => {
          this.links = {
            order: this.TelephonyMediator.getV6ToV4RedirectionUrl(
              'alias.number_order_new',
            ),
            bank: this.TelephonyMediator.getV6ToV4RedirectionUrl(
              'alias.number_bannMaker',
            ),
            numberDirectory: this.TelephonyMediator.getV6ToV4RedirectionUrl(
              'alias.number_manage_directory',
            ),
          };
          if (alias) {
            this.alias = alias;
            return this.$q
              .all({
                convertToLineTask: this.tucVoipServiceAlias.getConvertToLineTask(
                  alias,
                ),
                terminationTask: this.tucVoipService.getTerminationTask(alias),
                isSpecialNumber: this.tucVoipServiceAlias.isSpecialNumber(
                  alias,
                ),
              })
              .then((result) => {
                this.convertTask = result.convertToLineTask;
                this.terminationTask = result.terminationTask;
                this.isSpecialNumber = result.isSpecialNumber;

                return result;
              });
          }
          return null;
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant('telephony_alias_load_error')} ${get(
              error,
              'data.message',
              error.message,
            )}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    hasConsumption() {
      const typesWithoutConsumption = [
        'redirect',
        'ddi',
        'conference',
        'empty',
      ];
      return !typesWithoutConsumption.includes(this.alias.featureType);
    }

    aliasDescriptionSave() {
      return (newServiceDescription) => {
        const oldDescription = this.alias.description;
        this.alias.description = newServiceDescription;

        return this.tucVoipServiceAlias
          .editDescription(this.alias)
          .then(() => {
            this.SidebarMenu.updateItemDisplay(
              {
                title: this.alias.getDisplayedName(),
              },
              this.alias.serviceName,
              'telecom-telephony-section',
              this.alias.billingAccount,
            );
          })
          .catch((error) => {
            this.alias.description = oldDescription;
            this.TucToast.error(
              [
                this.$translate.instant(
                  'telephony_alias_rename_error',
                  this.serviceName,
                ),
                get(error, 'data.message', error.message),
              ].join(' '),
            );
          });
      };
    }

    isContactCenterSolution() {
      return this.alias.isContactCenterSolution();
    }

    isFeatureTypeObsolete() {
      return this.TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES.includes(
        this.alias.featureType,
      );
    }
  },
);
