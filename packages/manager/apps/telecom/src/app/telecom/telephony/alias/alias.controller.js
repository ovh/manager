import get from 'lodash/get';

import { OBSOLETE_FEATURE_TYPES } from './alias.constants';

export default class TelecomTelephonyAliasCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    serviceName,
    shellClient,
    TelephonyMediator,
    TucToast,
    tucVoipService,
    tucVoipServiceAlias,
    voipAliasGuides,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.shellClient = shellClient;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;
    this.tucVoipService = tucVoipService;
    this.tucVoipServiceAlias = tucVoipServiceAlias;

    this.billingAccount = $stateParams.billingAccount;
    this.serviceName = serviceName !== 'default' ? serviceName : null;
    this.guides = voipAliasGuides;
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
              isSpecialNumber: this.tucVoipServiceAlias.isSpecialNumber(alias),
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
    const typesWithoutConsumption = ['redirect', 'ddi', 'conference', 'empty'];
    return !typesWithoutConsumption.includes(this.alias.featureType);
  }

  aliasDescriptionSave() {
    return (newServiceDescription) => {
      const oldDescription = this.alias.description;
      this.alias.description = newServiceDescription;

      return this.tucVoipServiceAlias
        .editDescription(this.alias)
        .then(() => {
          this.shellClient.ux.updateMenuSidebarItemLabel(
            this.serviceName,
            `${this.serviceName} (${newServiceDescription})`,
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

  isContactCenterSolutionExpert() {
    return get(this, 'alias.featureType') === 'contactCenterSolutionExpert';
  }

  isFeatureTypeObsolete() {
    return OBSOLETE_FEATURE_TYPES.includes(this.alias.featureType);
  }
}
