angular.module('managerApp').controller('telephonyNumberOvhPabxDialplanExtensionRuleEditCtrl', function ($scope, $q, $filter, $translate, TelephonyMediator, TucToast) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.state = {
    collapse: false,
  };

  self.model = {
    search: '',
  };

  self.parentCtrl = null;
  self.ovhPabx = null;
  self.rule = null;
  self.availableActions = null;
  self.groups = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isRuleValid = function () {
    switch (self.rule.getActionFamily()) {
      case 'playback':
      case 'voicemail':
      case 'ivr':
      case 'hunting':
      case 'tts':
        return self.rule.actionParam;
      default:
        return true;
    }
  };

  self.isFormValid = function () {
    const ttsForm = _.get(self.extensionRuleForm, '$ctrl.ttsCreateForm');
    if (ttsForm) {
      return ttsForm.$dirty ? self.extensionRuleForm.$valid : true;
    }
    return self.extensionRuleForm.$valid;
  };

  /**
     *  @todo refactor with service choice popover
     */
  self.getServiceType = function (service) {
    if (service.serviceType === 'alias') {
      return 'number';
    }
    if (!service.isFax && service.isTrunk && service.isTrunk()) {
      return 'trunk';
    } if (service.isFax) {
      return 'fax';
    }
    return service.isPlugNFax ? 'plug_fax' : 'line';
  };

  /**
     *  @todo refactor with service choice popover
     */
  self.getServiceDisplayedName = function (service, isGroup) {
    if (isGroup) {
      return service.description && service.description !== service.billingAccount ? `${service.description} - ${service.billingAccount}` : service.billingAccount;
    }
    return service.description && service.description !== service.serviceName ? `${service.description} - ${service.serviceName}` : service.serviceName;
  };

  /**
     *  @todo refactor with service choice popover
     */
  self.getServiceGroupName = function (service) {
    return self.getServiceDisplayedName(_.find(TelephonyMediator.groups, {
      billingAccount: service.billingAccount,
    }), true);
  };

  /* ----------  Voicemail selection  ---------- */

  self.filterGroupServices = function (group) {
    return [].concat(group.lines, group.fax);
  };

  self.filterDisplayedGroup = function (group) {
    return $filter('tucPropsFilter')(self.filterGroupServices(group), {
      serviceName: self.model.search,
      description: self.model.search,
    }).length;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  /* ----------  ACTION CHOICE   ----------*/

  self.onActionChangeClick = function () {
    self.parentCtrl.popoverStatus.rightPage = 'actions';
    self.parentCtrl.popoverStatus.move = true;
  };

  self.onRuleActionChange = function () {
    self.parentCtrl.popoverStatus.move = false;
    self.rule.actionParam = '';
  };

  /* ----------  PLAYBACK ACTIONS  ----------*/

  self.onPlaybackActionParamButtonClick = function () {
    self.parentCtrl.popoverStatus.rightPage = 'playback';
    self.parentCtrl.popoverStatus.move = true;
  };

  self.onSoundSelected = function () {
    self.parentCtrl.popoverStatus.move = false;
  };

  /* ----------  VOICEMAIL ACTIONS  ----------*/

  self.onVoicemailActionParamButtonClick = function () {
    self.parentCtrl.popoverStatus.rightPage = 'voicemail';
    self.parentCtrl.popoverStatus.move = true;
  };

  self.onVoicemailActionParamChange = function (service) {
    self.parentCtrl.popoverStatus.move = false;
    self.rule.actionParamInfos = service;
  };

  /* ----------  IVR ACTIONS  ----------*/

  self.onIvrActionParamButtonClick = function () {
    self.parentCtrl.popoverStatus.rightPage = 'ivr';
    self.parentCtrl.popoverStatus.move = true;
  };

  self.onIvrMenuSelectedChange = function (menu) {
    if (menu) {
      self.parentCtrl.popoverStatus.move = false;
    }
  };

  self.onAddIvrMenuButtonClick = function () {
    // close popover
    self.parentCtrl.popoverStatus.isOpen = false;

    // create sub menu for menu entry
    self.rule.ivrMenu = self.ovhPabx.addMenu({
      name: $translate.instant('telephony_number_feature_ovh_pabx_step_rule_ivr_menu_add_menu_new_name', {
        index: self.ovhPabx.menus.length + 1,
      }),
      oldParent: angular.copy(self.rule.saveForEdition),
      status: 'DRAFT',
    });

    // stop edition of menu entry
    self.rule.stopEdition();
  };

  /* ----------  HUNTING  ----------*/

  self.onHuntingActionParamButtonClick = function () {
    self.parentCtrl.popoverStatus.rightPage = 'hunting';
    self.parentCtrl.popoverStatus.move = true;
  };

  /* ----------  TTS  ----------*/

  self.onTtsActionParamButtonClick = function () {
    self.parentCtrl.popoverStatus.rightPage = 'tts';
    self.parentCtrl.popoverStatus.move = true;
  };

  self.onAddTtsButtonClick = function () {
    self.state.collapse = true;
  };

  self.onTtsCreationCancel = function () {
    self.state.collapse = false;
  };

  self.onTtsCreationSuccess = function (tts) {
    self.rule.actionParam = tts.id;
    self.state.collapse = false;
    self.parentCtrl.popoverStatus.move = false;
  };

  /* ----------  FOOTER ACTIONS  ----------*/

  self.onValidateBtnClick = function () {
    const actionPromise = self.rule.status === 'DRAFT' ? self.rule.create() : self.rule.save();

    self.parentCtrl.popoverStatus.isOpen = false;

    return actionPromise.then(() => {
      self.rule.stopEdition();
      self.parentCtrl.numberCtrl.jsplumbInstance.customRepaint();
    }).catch((error) => {
      const errorTranslationKey = self.rule.status === 'DRAFT' ? 'telephony_number_feature_ovh_pabx_step_rule_create_error' : 'telephony_number_feature_ovh_pabx_step_rule_edit_error';
      TucToast.error([$translate.instant(errorTranslationKey), _.get(error, 'data.message') || ''].join(' '));
      return $q.reject(error);
    });
  };

  self.onCancelBtnClick = function () {
    self.parentCtrl.popoverStatus.isOpen = false;
    self.parentCtrl.popoverStatus.move = false;

    if (self.rule.status === 'DRAFT') {
      self.parentCtrl.extensionCtrl.extension.removeRule(self.rule);

      // check for collapsing or not the rules into extension component view
      self.parentCtrl.extensionCtrl.checkForDisplayHelpers();
    }
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
     *  Rule edition initialization
     */
  self.$onInit = function () {
    self.loading.init = true;

    self.parentCtrl = $scope.$parent.$ctrl;

    // get rule
    self.rule = self.parentCtrl.rule || self.parentCtrl.dialplanRule;

    // set ovh pabx ref
    self.ovhPabx = self.parentCtrl.numberCtrl.number.feature;

    // start rule edition
    self.rule.startEdition();

    // get available actions
    return TelephonyMediator.getApiModelEnum('telephony.OvhPabxDialplanExtensionRuleActionEnum').then((enumValues) => {
      self.availableActions = _.chain(enumValues).filter((enumVal) => {
        if (self.ovhPabx.featureType === 'cloudIvr') {
          return enumVal !== 'hunting' && enumVal !== 'tts';
        } if (!self.ovhPabx.isCcs) {
          return enumVal !== 'ivr' && enumVal !== 'tts';
        } if (self.ovhPabx.featureType === 'cloudHunting') {
          return enumVal !== 'ivr';
        }
        return true;
      }).map(enumVal => ({
        value: enumVal,
        label: $translate.instant(`telephony_number_feature_ovh_pabx_step_rule_${_.snakeCase(enumVal)}`),
        explain: $translate.instant(`telephony_number_feature_ovh_pabx_step_rule_${_.snakeCase(enumVal)}_explain`),
      })).value();

      // sort and filter groups and reject groups that don't have any service
      // used for voicemail selection
      self.groups = _.chain(TelephonyMediator.groups)
        .filter(group => group.getAllServices().length > 0)
        .sortBy(group => group.getDisplayedName())
        .value();
    }).finally(() => {
      self.loading.init = false;
    });
  };

  /**
     *  Rule edition destroy
     */
  self.$onDestroy = function () {
    if (self.rule && !self.parentCtrl.isLoading()) {
      self.rule.stopEdition(true);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
});
