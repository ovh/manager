import { JSPLUMB_INSTANCE_OPTIONS } from '../../../../../../../components/telecom/telephony/group/number/number.constants';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationOvhPabxMenusCtrl(
  $scope,
  $q,
  $stateParams,
  $translate,
  $timeout,
  TelephonyMediator,
  TucToast,
  tucJsPlumbService,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.model = {
    selectedMenu: null,
  };

  self.menu = null;
  self.jsPlumbInstanceOptions = JSPLUMB_INSTANCE_OPTIONS;
  self.jsPlumbInstance = null;

  /*= =============================
    =            EVENTS            =
    ============================== */

  function manageMenuDisplayChange(menu) {
    if (self.menu) {
      if (self.menu.status === 'DRAFT') {
        self.number.feature.removeMenu(self.menu);
      }
      self.menu.stopEdition(true);
    }
    self.menu = null;
    return $timeout(() => {
      // timeout to force menu redraw
      self.menu = menu;
    });
  }

  self.onAddMenuBtnClick = function onAddMenuBtnClick() {
    manageMenuDisplayChange(
      self.number.feature.addMenu({
        name: $translate.instant(
          'telephony_alias_ovh_pabx_menus_new_menu_name',
          {
            index: self.number.feature.menus.length + 1,
          },
        ),
        status: 'DRAFT',
      }),
    ).then(() => {
      self.model.selectedMenu = null;
      if (self.jsPlumbInstance) {
        self.jsPlumbInstance.customRepaint();
      }
    });
  };

  self.onMenuSelected = function onMenuSelected(menu) {
    manageMenuDisplayChange(
      menu ? self.number.feature.getMenu(menu.menuId) : null,
    );
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    let initPromises;

    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.number = group.getNumber($stateParams.serviceName);

        return self.number.feature.init().then(() => {
          if (self.number.getFeatureFamily() === 'ovhPabx') {
            initPromises = {
              menus: self.number.feature.getMenus(true),
              sounds: self.number.feature.getSounds(),
              tts: self.number.feature.getTts(),
              jsplumb: tucJsPlumbService.initJsPlumb(),
            };

            if (self.number.feature.featureType !== 'cloudIvr') {
              initPromises.queues = self.number.feature.getQueues();
            }

            return $q.all();
          }
          return null;
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_alias_configuration_load_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  /**
   *  What to do on controller destroy ?
   *  Remove draft menu from menu list
   */
  $scope.$on('$destroy', () => {
    if (self.menu) {
      self.number.feature.removeMenu(self.menu);
    }
  });

  /* -----  End of INITIALIZATION  ------*/
}
