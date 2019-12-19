import assign from 'lodash/assign';
import difference from 'lodash/difference';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';

angular.module('App')
  .controller('HostingChangeMainDomainCtrl', (
    $scope, $rootScope, $q, $stateParams, $translate,
    Alerter, atInternet, Hosting, hostingChangeDomain, Domain, WucEmails, User,
  ) => {
    $scope.model = {
      domain: null,
      mxplan: null,
      duration: null,
    };

    $scope.availableOffers = [];
    $scope.currentDomainName = $scope.currentActionData.serviceName;
    $scope.loading = {
      durations: null,
      availableOffer: true,
    };

    $scope.durations = null;

    $scope.agree = {
      value: false,
    };

    $scope.emailDisplayLimit = 5;

    /*= =============================
    =            STEP 1          =
    ============================== */
    $scope.hosting = $scope.currentActionData;
    $scope.emails = {
      hasSome: false, keep: false, urlGuideMxplan: '', data: null,
    };

    $scope.getAvailableOffers = function getAvailableOffers() {
      $scope.loading.availableOffer = true;

      User.getUrlOfEndsWithSubsidiary('MX_PLAN')
        .then((page) => {
          if (page) {
            $scope.emails.urlGuideMxplan = page;
          }
        });

      WucEmails.getEmails($stateParams.productId, {})
        .then((data) => {
          $scope.emails.data = data;

          if (!isEmpty(data)) {
            $scope.emails.hasSome = true;
            $scope.model.mxplan = null;
          }
        })
        .catch(() => {
          $scope.emails.data = [];
        });


      $q.all([Domain.getDomains(), Hosting.getHostings(), hostingChangeDomain.getModels()])
        .then((data) => {
          const domains = data[0];
          const hostings = data[1];
          const models = data[2];
          $scope.availableOffers = difference(domains, hostings);
          $scope.mxplanEnum = filter(models['hosting.web.order.MxPlanEnum'].enum, (mxEnum) => mxEnum !== 'delete');
        })
        .catch(() => {
          $scope.availableOffers = [];
        })
        .finally(() => {
          $scope.loading.availableOffer = false;
        });
    };

    $scope.checkEmails = function checkEmails() {
      if (isEmpty($scope.emails.data)) {
        $rootScope.$broadcast('wizard-goToStep', 3);
      }
    };

    /*= =============================
    =            STEP 2          =
    ============================== */
    $scope.validateEmailDecision = function validateEmailDecision() {
      const mustDeleteEmails = !$scope.emails.keep;
      const keepsEmailsWithNewPlan = $scope.emails.keep && !isEmpty($scope.model.mxplan);
      if (mustDeleteEmails || keepsEmailsWithNewPlan) {
        return true;
      }

      return false;
    };

    /*= =============================
    =            STEP 3          =
    ============================== */
    $scope.billingOnPrevious = function billingOnPrevious() {
      if (isEmpty($scope.emails.data)) {
        $rootScope.$broadcast('wizard-goToStep', 1);
      }
    };

    $scope.loadContracts = function loadContracts() {
      $scope.agree.value = false;
      $scope.loading.validation = true;
      $scope.loading.durations = true;

      let { mxplan } = $scope.model;

      const mustDeleteEmails = !$scope.emails.keep || isEmpty($scope.emails.data);
      if (mustDeleteEmails) {
        mxplan = 'delete';
      }

      hostingChangeDomain
        .getAllowedDurations($stateParams.productId, {
          domain: $scope.model.domain,
          mxplan,
        })
        .then((durations) => {
          const priceAndContractPromises = map(
            durations,
            (duration) => hostingChangeDomain.get($stateParams.productId, {
              duration,
              domain: $scope.model.domain,
              mxplan,
            })
              .then((data) => assign({ duration }, data))
              .catch((err) => Alerter.alertFromSWS($translate.instant('hosting_order_upgrade_error'), err, $scope.alerts.main))
              .finally(() => {
                $scope.loading.validation = false;
              }),
          );

          $q.all(priceAndContractPromises)
            .then((data) => {
              $scope.durations = data;
              [$scope.model.duration] = $scope.durations;
            })
            .catch((err) => Alerter.alertFromSWS($translate.instant('hosting_order_upgrade_error'), err, $scope.alerts.main))
            .finally(() => { $scope.loading.durations = false; });
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          Alerter.alertFromSWS($translate.instant('hosting_order_upgrade_error'), err, $scope.alerts.main);
          $scope.resetAction();
        });
    };

    $scope.getResumePrice = function getResumePrice(price) {
      return price.value === 0 ? $translate.instant('price_free') : $translate.instant('price_ht_label', { price: price.text });
    };

    $scope.orderUpgrade = function orderUpgrade() {
      $scope.loading.validation = true;

      let { mxplan } = $scope.model;
      const mustDeleteEmails = !$scope.emails.keep;
      if (mustDeleteEmails) {
        mxplan = 'delete';
      }

      hostingChangeDomain
        .post($stateParams.productId, {
          duration: $scope.model.duration.duration,
          domain: $scope.model.domain,
          mxplan,
        })
        .then((order) => {
          atInternet.trackOrder({
            name: '[hosting]::change-main-domain[change-main-domain]',
            page: 'web::hosting',
            orderId: order.orderId,
            priceTaxFree: order.prices.withoutTax.value,
            price: order.prices.withTax.value,
          });
          Alerter.success($translate.instant('hosting_order_upgrade_success', { t0: order.url, t1: order.orderId }), $scope.alerts.main);
        })
        .catch((err) => Alerter.alertFromSWS($translate.instant('hosting_order_upgrade_error'), err, $scope.alerts.main))
        .finally(() => {
          $scope.resetAction();
          $scope.loading.validation = false;
        });
    };

    $scope.validateOrder = function validateOrder() {
      return !$scope.loading.validation && $scope.agree.value;
    };
  });
