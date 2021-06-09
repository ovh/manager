import get from 'lodash/get';

export default class TelecomTelephonyAliasConfigurationCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    atInternet,
    TelephonyMediator,
    TucToast,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TucToast = TucToast;
    this.TelephonyMediator = TelephonyMediator;
  }

  $onInit() {
    this.loading = true;

    this.actions = null;
    this.number = null;

    this.billingAccount = this.$stateParams.billingAccount;
    this.serviceName = this.$stateParams.serviceName;

    return this.TelephonyMediator.getGroup(this.billingAccount)
      .then((group) => group.fetchService(this.serviceName))
      .then((number) => {
        this.number = number;

        return this.number.feature.init().then(() => {
          this.featureTypeLabel = this.$translate
            .instant(
              `telephony_alias_config_change_type_label_${this.groupFeatureType()}`,
            )
            .toLowerCase();
          this.actions = this.getFeatureTypeActions();

          this.atInternet.trackPage({
            name: 'configuration',
            type: 'navigation',
            level2: 'Telecom',
            chapter1: 'telecom',
          });
        });
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_load_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getFeatureTypeActions() {
    const ovhPabxActions = [
      {
        name: 'number_modification_new',
        sref:
          'telecom.telephony.billingAccount.alias.details.configuration.changeType',
        text: this.$translate.instant(
          'telephony_alias_configuration_actions_number_modification_new',
        ),
        onClick: () => {
          this.atInternet.trackClick({
            name: 'ccs::group-number::change-the-type-of-number',
            type: 'navigation',
          });
        },
      },
    ];

    if (this.number.getFeatureFamily() === 'ovhPabx') {
      ovhPabxActions.push({ divider: true });
      // add member/agent and queues for cloudHunting
      if (this.number.feature.featureType !== 'cloudIvr') {
        const isContactCenterSolutionExpert =
          this.number.feature.featureType === 'contactCenterSolutionExpert';
        // agents for "CCS expert" - members for "File d'appel expert"
        ovhPabxActions.push({
          name: isContactCenterSolutionExpert
            ? 'number_cloud_hunting_agents'
            : 'number_easy_hunting_members',
          sref:
            'telecom.telephony.billingAccount.alias.details.configuration.agents.ovhPabx',
          text: this.$translate.instant(
            isContactCenterSolutionExpert
              ? 'telephony_alias_configuration_actions_number_hunting_agents'
              : 'telephony_alias_configuration_actions_number_hunting_members',
          ),
          onClick: () => {
            this.atInternet.trackClick({
              name: 'ccs::group-number::manage-agents',
              type: 'navigation',
            });
          },
        });

        // queue for both "CCS expert" and "File d'appel expert"
        ovhPabxActions.push({
          name: 'number_cloud_hunting_queues',
          sref:
            'telecom.telephony.billingAccount.alias.details.configuration.queues.ovhPabx',
          text: this.$translate.instant(
            'telephony_alias_configuration_actions_number_hunting_queues',
          ),
          onClick: () => {
            this.atInternet.trackClick({
              name: 'ccs::group-number::manage-queues',
              type: 'navigation',
            });
          },
        });
      }

      // add menu link exept for "File d'appel expert"
      if (
        ['cloudIvr', 'contactCenterSolutionExpert'].includes(
          this.number.feature.featureType,
        )
      ) {
        ovhPabxActions.push({
          name: 'number_ovh_pabx_menus',
          sref:
            'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.menus',
          text: this.$translate.instant(
            'telephony_alias_configuration_actions_menus_management',
          ),
          onClick: () => {
            this.atInternet.trackClick({
              name: 'ccs::group-number::manage-menus',
              type: 'navigation',
            });
          },
        });
      }

      // add tts link for "CCS expert"
      if (this.number.feature.featureType === 'contactCenterSolutionExpert') {
        ovhPabxActions.push({
          name: 'number_ovh_pabx_tts',
          sref:
            'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.tts',
          text: this.$translate.instant(
            'telephony_alias_configuration_actions_tts_management',
          ),
          onClick: () => {
            this.atInternet.trackClick({
              name: 'ccs::group-number::manage-tts',
              type: 'navigation',
            });
          },
        });
      }

      // add links for all : "CCS expert", "Serveur Vocal interactif" and "File d'appel expert"
      // sound
      // events
      ovhPabxActions.push(
        {
          name: 'number_ovh_pabx_sounds',
          sref:
            'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.sounds',
          text: this.$translate.instant(
            'telephony_alias_configuration_actions_sounds_management',
          ),
          onClick: () => {
            this.atInternet.trackClick({
              name: 'ccs::group-number::manage-sounds',
              type: 'navigation',
            });
          },
        },
        {
          divider: true,
        },
        {
          name: 'number_cloud_hunting_events',
          sref:
            'telecom.telephony.billingAccount.alias.details.configuration.schedulerOvhPabx',
          text: this.$translate.instant(
            'telephony_alias_configuration_actions_number_cloud_hunting_events',
          ),
          onClick: () => {
            this.atInternet.trackClick({
              name: 'ccs::group-number::manage-exceptional-time-slot',
              type: 'navigation',
            });
          },
        },
      );
    }
    return ovhPabxActions;
  }

  groupFeatureType() {
    const sameFeatures = ['easyHunting', 'cloudHunting'];
    let featureType = sameFeatures.includes(this.number.feature.featureType)
      ? 'contactCenterSolution'
      : this.number.feature.featureType;
    featureType = featureType === 'ddi' ? 'redirect' : featureType;

    return featureType;
  }

  isSubwayPlanActive() {
    const complexFeatures = ['cloudIvr', 'svi', 'contactCenterSolutionExpert'];
    return complexFeatures.includes(this.number.feature.featureType);
  }
}
