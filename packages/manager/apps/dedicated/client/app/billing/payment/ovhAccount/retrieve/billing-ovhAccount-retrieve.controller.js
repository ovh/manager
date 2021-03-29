import filter from 'lodash/filter';

angular
  .module('Billing.controllers')
  .controller(
    'Billing.controllers.OvhAccountRetrieve',
    (
      $q,
      $scope,
      $state,
      $timeout,
      $translate,
      $window,
      Alerter,
      atInternet,
      BillingOvhAccount,
      User,
      OVH_ACCOUNT_EVENT,
      ovhPaymentMethod,
    ) => {
      $scope.accountModel = $scope.currentActionData;
      $scope.retrieve = {
        amount: 0,
        account: '',
      };

      function getBankAccounts() {
        return ovhPaymentMethod
          .getAllPaymentMethods()
          .then((paymentMethods) =>
            filter(
              paymentMethods,
              (paymentMethod) => paymentMethod.paymentType === 'BANK_ACCOUNT',
            ),
          );
      }

      $scope.initStep1 = () => {
        $scope.loading = true;
        $q.all([getBankAccounts(), User.getUser()])
          .then(([bankAccounts, user]) => {
            $scope.bankAccounts = bankAccounts;
            $scope.user = user;
          })
          .finally(() => {
            $scope.loading = false;
          });
      };

      $scope.goToAddBankAccount = () => {
        $scope.resetAction();
        $timeout(
          () =>
            $state.go('app.account.billing.payment.method.add', {
              from: 'app.account.billing.payment.ovhaccount',
            }),
          300,
        );
      };

      $scope.initStep2 = () => {
        $scope.price = $scope.accountModel.balanceText.replace(
          /([0-9]|\s|\.|,)+/g,
          $scope.retrieve.amount,
        );
      };

      $scope.validate = () => {
        $scope.loading = true;
        BillingOvhAccount.retrieveMoney(
          $scope.accountModel.accountId,
          $scope.retrieve.amount * 100,
          $scope.retrieve.account.paymentMethodId,
        )
          .then((order) => {
            atInternet.trackClick({
              name: 'validation_transfer_bank_account',
              type: 'action',
              chapter1: 'payment_types',
              chapter2: 'prepaid_account',
            });
            $scope.$emit(OVH_ACCOUNT_EVENT.TRANSFER_TO_BANK_ACCOUNT);
            $scope.retrieveOrder = {
              ...order,
              prices: {
                withTax: order.priceWithTax.text.replace('-', ''),
                withoutTax: order.priceWithoutTax,
                tax: order.tax,
              },
            };
            $window.open($scope.retrieveOrder.url);
            Alerter.success(
              $translate.instant('ovhAccount_retrieve_success', {
                t0: $scope.retrieveOrder.url,
              }),
            );
          })
          .catch((err) => {
            Alerter.alertFromSWS(
              $translate.instant('ovhAccount_retrieve_error'),
              err,
            );
          })
          .finally(() => {
            $scope.loading = false;
            $scope.resetAction();
          });
      };
    },
  );
