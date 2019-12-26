angular
  .module('managerApp')
  .controller('TelephonyNumberCtrl', function TelephonyNumberCtrl(
    $q,
    $translate,
    $translatePartialLoader,
    tucJsPlumbService,
    TucToast,
    TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS,
    TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS,
    TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS,
  ) {
    const self = this;

    self.loading = {
      init: false,
      feature: false,
      translations: false,
      save: false,
    };

    self.saveFeature = angular.noop;
    self.jsplumbInstance = null;
    self.jsPlumbInstanceOptions = TELPHONY_NUMBER_JSPLUMB_INSTANCE_OPTIONS;
    self.jsPlumbEndpointsOptions = TELEPHONY_NUMBER_JSPLUMB_ENDPOINTS_OPTIONS;
    self.jsPlumbConnectionsOptions = TELEPHONY_NUMBER_JSPLUMB_CONNECTIONS_OPTIONS;

    /*= ==============================
    =            ACTIONS            =
    =============================== */

    self.saveNumber = function saveNumber() {
      self.loading.save = true;

      if (self.number.getFeatureFamily() === 'ovhPabx') {
        return $q.when(self.number);
      }

      return self.number.save().then(
        () => {
          // number is saved - stop its edition only
          self.number.stopEdition().startEdition();

          // resolve save defered to tell feature sub component to launch feature save
          return self.saveFeature();
        },
        (error) => {
          self.loading.save = false;
          TucToast.error(
            [
              $translate.instant('telephony_number_save_error'),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
          return $q.reject(error);
        },
      );
    };

    /* -----  End of ACTIONS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

    /* ----------  Translations load  ----------*/

    function getTranslations() {
      self.loading.translations = true;

      $translatePartialLoader.addPart(
        '../components/telecom/telephony/group/number',
      );
      if (self.number.getFeatureFamily() === 'conference') {
        $translatePartialLoader.addPart(
          '../components/telecom/telephony/group/number/feature/conference',
        );
      }
      return $translate.refresh().finally(() => {
        self.loading.translations = false;
      });
    }

    /* ----------  Component initialization  ----------*/

    self.$onInit = function $onInit() {
      self.loading.init = true;

      return $q
        .all([getTranslations(), tucJsPlumbService.initJsPlumb()])
        .finally(() => {
          self.loading.init = false;
        });
    };

    self.$onDestroy = function $onDestroy() {
      self.number.stopEdition(true, true);
    };

    /* -----  End of INITIALIZATION  ------*/
  });
