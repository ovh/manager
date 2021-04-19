import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isString from 'lodash/isString';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';

export default class DialplanExtensionRuleEditCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $filter,
    $translate,
    $state,
    atInternet,
    TelephonyMediator,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$filter = $filter;
    this.$translate = $translate;
    this.$state = $state;
    this.atInternet = atInternet;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;

    this.loading = {
      init: false,
    };

    this.state = {
      collapse: false,
    };

    this.parentCtrl = null;
    this.ovhPabx = null;
    this.rule = null;
    this.availableActions = null;
    this.groups = null;
    this.groupsFiltered = {};
  }

  $onInit() {
    this.loading.init = true;

    this.parentCtrl = this.$scope.$parent.$ctrl;

    // get rule
    this.rule = this.parentCtrl.rule || this.parentCtrl.dialplanRule;

    // set ovh pabx ref
    this.ovhPabx = this.parentCtrl.numberCtrl.number.feature;

    // start rule edition
    this.rule.startEdition();

    this.model = {
      search: '',
    };

    // get available actions
    return this.TelephonyMediator.getApiModelEnum(
      'telephony.OvhPabxDialplanExtensionRuleActionEnum',
    )
      .then((enumValues) => {
        this.availableActions = map(
          filter(enumValues, (enumVal) => {
            if (this.ovhPabx.featureType === 'cloudIvr') {
              return enumVal !== 'hunting' && enumVal !== 'tts';
            }
            if (!this.ovhPabx.isCcs) {
              return enumVal !== 'ivr' && enumVal !== 'tts';
            }
            if (this.ovhPabx.featureType === 'cloudHunting') {
              return enumVal !== 'ivr';
            }
            return true;
          }),
          (enumVal) => ({
            value: enumVal,
            label: this.$translate.instant(
              `telephony_number_feature_ovh_pabx_step_rule_${snakeCase(
                enumVal,
              )}`,
            ),
            explain: this.$translate.instant(
              `telephony_number_feature_ovh_pabx_step_rule_${snakeCase(
                enumVal,
              )}_explain`,
            ),
          }),
        );

        // sort and filter groups and reject groups that don't have any service
        // used for voicemail selection
        this.groups = sortBy(
          filter(
            this.TelephonyMediator.groups,
            (group) => group.getAllServices().length > 0,
          ),
          (group) => group.getDisplayedName(),
        );

        this.groupsFiltered = this.groups.filter((group) =>
          this.filterDisplayedGroup(group),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  $onDestroy() {
    if (this.rule && !this.parentCtrl.isLoading()) {
      this.rule.stopEdition(true);
    }
  }

  isRuleValid() {
    switch (this.rule.getActionFamily()) {
      case 'playback':
      case 'voicemail':
      case 'ivr':
      case 'hunting':
      case 'tts':
        return this.rule.actionParam;
      default:
        return true;
    }
  }

  isFormValid() {
    const ttsForm = get(this.extensionRuleForm, '$ctrl.ttsCreateForm');
    if (ttsForm) {
      return ttsForm.$dirty ? this.extensionRuleForm.$valid : true;
    }
    return this.extensionRuleForm.$valid;
  }

  /**
   *  @todo refactor with service choice popover
   */
  // eslint-disable-next-line class-methods-use-this
  getServiceType(service) {
    if (service.serviceType === 'alias') {
      return 'number';
    }
    if (!service.isFax && service.isTrunk && service.isTrunk()) {
      return 'trunk';
    }
    if (service.isFax) {
      return 'fax';
    }
    return service.isPlugNFax ? 'plug_fax' : 'line';
  }

  /**
   *  @todo refactor with service choice popover
   */
  // eslint-disable-next-line class-methods-use-this
  getServiceDisplayedName(service, isGroup) {
    if (isString(service)) return service;
    if (isGroup) {
      return service.description &&
        service.description !== service.billingAccount
        ? `${service.description} - ${service.billingAccount}`
        : service.billingAccount;
    }
    return service.description && service.description !== service.serviceName
      ? `${service.description} - ${service.serviceName}`
      : service.serviceName;
  }

  /**
   *  @todo refactor with service choice popover
   */
  getServiceGroupName(service) {
    return this.getServiceDisplayedName(
      find(this.TelephonyMediator.groups, {
        billingAccount: service.billingAccount,
      }),
      true,
    );
  }

  /* ----------  Voicemail selection  ---------- */

  // eslint-disable-next-line class-methods-use-this
  filterGroupServices(group) {
    return [].concat(group.lines, group.fax);
  }

  filterDisplayedGroup(group) {
    return this.$filter('tucPropsFilter')(this.filterGroupServices(group), {
      serviceName: this.model.search,
      description: this.model.search,
    }).length;
  }

  /* ----------  ACTION CHOICE   ----------*/

  onActionChangeClick() {
    this.parentCtrl.popoverStatus.rightPage = 'actions';
    this.parentCtrl.popoverStatus.move = true;
  }

  onRuleActionChange() {
    this.parentCtrl.popoverStatus.move = false;
    this.rule.actionParam = '';
    const step = this.parentCtrl.extension.position;

    switch (this.rule.action) {
      case 'bridge':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::transfer-call`,
          type: 'action',
        });
        break;
      case 'endless_playback':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::play-a-song-endlessly`,
          type: 'action',
        });
        break;
      case 'hangup':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::hang-up`,
          type: 'action',
        });
        break;
      case 'hunting':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::ring-the-queue-members`,
          type: 'action',
        });
        break;
      case 'ivr':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::launch-interactive-menu`,
          type: 'action',
        });
        break;
      case 'playback':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::play-a-song`,
          type: 'action',
        });
        break;
      case 'readDtmf':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::dtmf-entry-variable`,
          type: 'action',
        });
        break;
      case 'setCallerName':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::set-a-caller-name`,
          type: 'action',
        });
        break;
      case 'sleep':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::start-a-timer`,
          type: 'action',
        });
        break;
      case 'tts':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::link-a-tts`,
          type: 'action',
        });
        break;
      case 'voicemail':
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::send-to-answering-machine`,
          type: 'action',
        });
        break;
      default:
        break;
    }
  }

  /* ----------  PLAYBACK ACTIONS  ----------*/

  onPlaybackActionParamButtonClick() {
    this.parentCtrl.popoverStatus.rightPage = 'playback';
    this.parentCtrl.popoverStatus.move = true;
  }

  onSoundSelected() {
    this.parentCtrl.popoverStatus.move = false;
  }

  /* ----------  VOICEMAIL ACTIONS  ----------*/

  onVoicemailActionParamButtonClick() {
    this.parentCtrl.popoverStatus.rightPage = 'voicemail';
    this.parentCtrl.popoverStatus.move = true;
  }

  onVoicemailActionParamChange(service) {
    this.parentCtrl.popoverStatus.move = false;
    this.rule.actionParamInfos = service;
  }

  /* ----------  IVR ACTIONS  ----------*/

  onIvrActionParamButtonClick() {
    this.parentCtrl.popoverStatus.rightPage = 'ivr';
    this.parentCtrl.popoverStatus.move = true;
  }

  onAddIvrMenuButtonClick() {
    // close popover
    this.parentCtrl.popoverStatus.isOpen = false;

    // go to OvhPabx menus to create sub menu for menu entry
    this.$state.go(
      'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.menus',
    );

    // stop edition of menu entry
    this.rule.stopEdition();
  }

  /* ----------  HUNTING  ----------*/

  onHuntingActionParamButtonClick() {
    this.parentCtrl.popoverStatus.rightPage = 'hunting';
    this.parentCtrl.popoverStatus.move = true;
  }

  /* ----------  TTS  ----------*/

  onTtsActionParamButtonClick() {
    this.parentCtrl.popoverStatus.rightPage = 'tts';
    this.parentCtrl.popoverStatus.move = true;
  }

  onAddTtsButtonClick() {
    this.state.collapse = true;
  }

  onTtsCreationCancel() {
    this.state.collapse = false;
  }

  onTtsCreationSuccess(tts) {
    this.rule.actionParam = tts.id;
    this.state.collapse = false;
    this.parentCtrl.popoverStatus.move = false;
  }

  /* ----------  FOOTER ACTIONS  ----------*/

  onValidateBtnClick() {
    const actionPromise =
      this.rule.status === 'DRAFT' ? this.rule.create() : this.rule.save();
    const step = this.parentCtrl.extension.position;

    this.parentCtrl.popoverStatus.isOpen = false;

    return actionPromise
      .then(() => {
        this.rule.stopEdition();
        this.atInternet.trackClick({
          name: `ccs::dialplan::execute-actions-step-${step}::${
            this.rule.status === 'DRAFT' ? '' : 'modify-'
          }validate`,
          type: 'action',
        });
      })
      .catch((error) => {
        const errorTranslationKey =
          this.rule.status === 'DRAFT'
            ? 'telephony_number_feature_ovh_pabx_step_rule_create_error'
            : 'telephony_number_feature_ovh_pabx_step_rule_edit_error';
        this.TucToast.error(
          [
            this.$translate.instant(errorTranslationKey),
            get(error, 'data.message') || '',
          ].join(' '),
        );
        return this.$q.reject(error);
      });
  }

  onCancelBtnClick() {
    const step = this.parentCtrl.extension.position;
    this.parentCtrl.onCancelRuleEdit();
    this.atInternet.trackClick({
      name: `ccs::dialplan::execute-actions-step-${step}::${
        this.rule.status === 'DRAFT' ? '' : 'modify-'
      }cancel`,
      type: 'action',
    });
  }
}
